import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import db from "~/db.server";

export async function loader({ params }: LoaderArgs) {
  const recipe = await db.recipe.findUnique({ where: { id: params.recipeId } });

  return json({ recipe });
}

export default function RecipeDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{data.recipe?.name}</h1>
    </div>
  );
}
