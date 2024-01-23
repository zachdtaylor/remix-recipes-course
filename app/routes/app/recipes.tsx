import { requireLoggedInUser } from "~/utils/auth.server";
import { Route } from "./+types/recipes";
import db from "~/db.server";
import { NavLink, Outlet, useLoaderData } from "react-router";
import {
  RecipeCard,
  RecipeDetailWrapper,
  RecipeListWrapper,
  RecipePageWrapper,
} from "~/components/recipes";
import { SearchBar } from "~/components/form";

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
  });

  return { recipes };
}

export default function Recipes() {
  const data = useLoaderData<typeof loader>();

  return (
    <RecipePageWrapper>
      <RecipeListWrapper>
        <SearchBar placeholder="Search Recipes..." />
        <ul>
          {data?.recipes.map((recipe) => (
            <li className="my-4" key={recipe.id}>
              <NavLink reloadDocument to={recipe.id}>
                {({ isActive }) => (
                  <RecipeCard
                    name={recipe.name}
                    totalTime={recipe.totalTime}
                    imageUrl={recipe.imageUrl}
                    isActive={isActive}
                  />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </RecipeListWrapper>
      <RecipeDetailWrapper>
        <Outlet />
      </RecipeDetailWrapper>
    </RecipePageWrapper>
  );
}
