import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover";
import db from "~/db.server";
import { hash } from "~/utils/cryptography.server";

export function headers() {
  return {
    "Cache-Control": `max-age=3600, stale-while-revalidate=${3600 * 24 * 7}`,
  };
}

export async function loader({ params, request }: LoaderArgs) {
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
    throw json(
      {
        message: `A recipe with id ${params.id} does not exist.`,
      },
      { status: 404 }
    );
  }

  const etag = hash(JSON.stringify(recipe));

  if (etag === request.headers.get("if-none-match")) {
    return new Response(null, { status: 304 });
  }

  return json(
    { recipe },
    {
      headers: {
        etag,
        "cache-control": "max-age=5, stale-while-revalidate=10",
      },
    }
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
