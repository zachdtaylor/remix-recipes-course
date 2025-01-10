import db from "~/db.server";
import { Route } from "./+types/$recipeId";
import { useLoaderData } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({ where: { id: params.recipeId } });

  return { recipe };
}

export default function RecipeDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{data.recipe?.name}</h1>
    </div>
  );
}
