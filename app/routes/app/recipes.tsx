import { requireLoggedInUser } from "~/utils/auth.server";
import { Route } from "./+types/recipes";
import db from "~/db.server";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import { DeleteButton, PrimaryButton, SearchBar } from "~/components/form";
import { CalendarIcon, PlusIcon } from "~/components/icons";
import {
  useSaveRecipeNameFetcher,
  useSaveRecipeTotalTimeFetcher,
} from "~/utils/hooks";
import { formDataValueAsString } from "~/utils/forms";
import { mealPlanModalIsOpeningOrClosing } from "~/utils/revalidation";
import classNames from "classnames";
import { useBuildSearchParams } from "~/utils/misc";

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  return !mealPlanModalIsOpeningOrClosing(arg);
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireLoggedInUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const filter = url.searchParams.get("filter");

  const recipes = await db.recipe.findMany({
    where: {
      userId: user.id,
      name: {
        contains: q ?? "",
        mode: "insensitive",
      },
      mealPlanMultiplier: filter === "mealPlanOnly" ? { not: null } : {},
    },
    select: {
      name: true,
      totalTime: true,
      imageUrl: true,
      id: true,
      mealPlanMultiplier: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { recipes };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireLoggedInUser(request);
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "createRecipe": {
      const recipe = await db.recipe.create({
        data: {
          userId: user.id,
          name: "New Recipe",
          totalTime: "0 min",
          imageUrl: "https://placehold.co/150?text=Remix+Recipes",
          instructions: "",
        },
      });

      const url = new URL(request.url);
      url.pathname = `/app/recipes/${recipe.id}`;

      return redirect(url.toString());
    }
    case "clearMealPlan": {
      await db.recipe.updateMany({
        where: {
          userId: user.id,
        },
        data: { mealPlanMultiplier: null },
      });
      return redirect("/app/recipes");
    }
    default: {
      return null;
    }
  }
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>();
  const buildSearchParams = useBuildSearchParams();
  const [searchParams] = useSearchParams();
  const mealPlanOnlyFilterOn = searchParams.get("filter") === "mealPlanOnly";

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <div className="flex gap-4">
          <SearchBar placeholder="Search Recipes..." className="flex-grow" />
          <Link
            reloadDocument
            to={buildSearchParams(
              "filter",
              mealPlanOnlyFilterOn ? "" : "mealPlanOnly"
            )}
            className={classNames(
              "flex flex-col justify-center border-2 border-primary rounded-md px-2",
              {
                "text-white bg-primary": mealPlanOnlyFilterOn,
                "text-primary": !mealPlanOnlyFilterOn,
              }
            )}
          >
            <CalendarIcon />
          </Link>
        </div>
        <Form method="post" className="mt-4" reloadDocument>
          {mealPlanOnlyFilterOn ? (
            <DeleteButton
              name="_action"
              value="clearMealPlan"
              className="w-full"
            >
              Clear Plan
            </DeleteButton>
          ) : (
            <PrimaryButton
              name="_action"
              value="createRecipe"
              className="w-full"
            >
              <div className="flex w-full justify-center">
                <PlusIcon />
                <span className="ml-2">Create New Recipe</span>
              </div>
            </PrimaryButton>
          )}
        </Form>
        <ul>
          {data?.recipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}

type RecipeListItemProps = {
  recipe: {
    id: string;
    name: string;
    mealPlanMultiplier: number | null;
    totalTime: string;
    imageUrl: string;
  };
};
function RecipeListItem({ recipe }: RecipeListItemProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.location?.pathname.endsWith(recipe.id);
  const saveNameFetcher = useSaveRecipeNameFetcher(recipe.id);
  const saveTotalTimeFetcher = useSaveRecipeTotalTimeFetcher(recipe.id);

  const optimisticData = {
    name: formDataValueAsString(saveNameFetcher.formData?.get("name")),
    totalTime: formDataValueAsString(
      saveTotalTimeFetcher.formData?.get("totalTime")
    ),
  };

  return (
    <li className="my-4" key={recipe.id}>
      <NavLink
        to={{ pathname: recipe.id, search: location.search }}
        prefetch="intent"
      >
        {({ isActive }) => (
          <RecipeCard
            name={optimisticData.name ?? recipe.name}
            totalTime={optimisticData.totalTime ?? recipe.totalTime}
            mealPlanMultiplier={recipe.mealPlanMultiplier}
            imageUrl={recipe.imageUrl}
            isActive={isActive}
            isLoading={isLoading}
          />
        )}
      </NavLink>
    </li>
  );
}
