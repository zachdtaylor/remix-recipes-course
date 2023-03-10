import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useFetchers,
  useLoaderData,
  useLocation,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { PrimaryButton, SearchBar } from "~/components/forms";
import { CalendarIcon, PlusIcon } from "~/components/icons";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import db from "~/db.server";
import { requireLoggedInUser } from "~/utils/auth.server";
import { classNames } from "~/utils/misc";

export async function loader({ request }: LoaderArgs) {
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

  return json({ recipes });
}

export async function action({ request }: ActionArgs) {
  const user = await requireLoggedInUser(request);

  const recipe = await db.recipe.create({
    data: {
      userId: user.id,
      name: "New Recipe",
      totalTime: "0 min",
      imageUrl: "https://via.placeholder.com/150?text=Remix+Recipes",
      instructions: "",
    },
  });

  const url = new URL(request.url);
  url.pathname = `/app/recipes/${recipe.id}`;

  return redirect(url.toString());
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const transition = useTransition();
  const fetchers = useFetchers();
  const [searchParams] = useSearchParams();
  const mealPlanOnlyFilterOn = searchParams.get("filter") === "mealPlanOnly";

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <div className="flex gap-4">
          <SearchBar placeholder="Search Recipes..." className="flex-grow" />
          <Link
            reloadDocument
            to={mealPlanOnlyFilterOn ? "?filter=" : "?filter=mealPlanOnly"}
            className={classNames(
              "flex flex-col justify-center border-2 border-primary rounded-md px-2",
              mealPlanOnlyFilterOn ? "text-white bg-primary" : "text-primary"
            )}
          >
            <CalendarIcon />
          </Link>
        </div>
        <Form method="post" className="mt-4" reloadDocument>
          <PrimaryButton className="w-full">
            <div className="flex w-full justify-center">
              <PlusIcon />
              <span className="ml-2">Create New Recipe</span>
            </div>
          </PrimaryButton>
        </Form>
        <ul>
          {data?.recipes.map((recipe) => {
            const isLoading = transition.location?.pathname.endsWith(recipe.id);

            const optimisticData = new Map();

            for (const fetcher of fetchers) {
              if (fetcher.submission?.action?.includes(recipe.id)) {
                if (fetcher.submission.formData.get("_action") === "saveName") {
                  optimisticData.set(
                    "name",
                    fetcher.submission.formData.get("name")
                  );
                }
                if (
                  fetcher.submission.formData.get("_action") === "saveTotalTime"
                ) {
                  optimisticData.set(
                    "totalTime",
                    fetcher.submission.formData.get("totalTime")
                  );
                }
              }
            }

            return (
              <li className="my-4" key={recipe.id}>
                <NavLink
                  to={{ pathname: recipe.id, search: location.search }}
                  prefetch="intent"
                >
                  {({ isActive }) => (
                    <RecipeCard
                      name={optimisticData.get("name") ?? recipe.name}
                      totalTime={
                        optimisticData.get("totalTime") ?? recipe.totalTime
                      }
                      mealPlanMultiplier={recipe.mealPlanMultiplier}
                      imageUrl={recipe.imageUrl}
                      isActive={isActive}
                      isLoading={isLoading}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
