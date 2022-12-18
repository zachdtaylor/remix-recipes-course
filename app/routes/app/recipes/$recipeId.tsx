import db from "~/db.server";
import { Route } from "./+types/$recipeId";
import { data, useLoaderData } from "react-router";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({ where: { id: params.recipeId } });

  return data({ recipe }, { headers: { "Cache-Control": "max-age=5" } });
}

export default function RecipeDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{data.recipe?.name}</h1>
    </div>
  );
}
