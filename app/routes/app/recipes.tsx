import { requireLoggedInUser } from "~/utils/auth.server";
import { Route } from "./+types/recipes";
import db from "~/db.server";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import { PrimaryButton, SearchBar } from "~/components/form";
import { PlusIcon } from "~/components/icons";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireLoggedInUser(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const recipes = await db.recipe.findMany({
    where: {
      userId: user.id,
      name: {
        contains: q ?? "",
        mode: "insensitive",
      },
    },
    select: { name: true, totalTime: true, imageUrl: true, id: true },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { recipes };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireLoggedInUser(request);

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

export default function Recipes() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <SearchBar placeholder="Search Recipes..." />
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
            const isLoading = navigation.location?.pathname.endsWith(recipe.id);
            return (
              <li className="my-4" key={recipe.id}>
                <NavLink
                  to={{ pathname: recipe.id, search: location.search }}
                  prefetch="intent"
                >
                  {({ isActive }) => (
                    <RecipeCard
                      name={recipe.name}
                      totalTime={recipe.totalTime}
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
