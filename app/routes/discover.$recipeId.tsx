import db from "~/db.server";
import { Route } from "./+types/discover.$recipeId";
import { data, useLoaderData } from "react-router";
import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover";
import { hash } from "~/utils/cryptography.server";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          name: true,
          amount: true,
        },
      },
    },
  });

  if (recipe === null) {
    throw data(
      {
        message: `A recipe with id ${params.recipeId} does not exist.`,
      },
      { status: 404 }
    );
  }

  const etag = hash(JSON.stringify(recipe));

  return data(
    { recipe },
    { headers: { etag, "cache-control": "stale-while-revalidate=60" } }
  );
}

export default function DiscoverRecipe() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="md:h-[calc(100vh-1rem)] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={data.recipe} />
      <DiscoverRecipeDetails recipe={data.recipe} />
    </div>
  );
}
