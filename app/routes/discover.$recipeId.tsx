import db from "~/db.server";
import { Route } from "./+types/discover.$recipeId";
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
  });

  if (recipe === null) {
    throw data(
      {
        message: `A recipe with id ${params.id} does not exist.`,
      },
      { status: 404 }
    );
  }

  return { recipe };
}
