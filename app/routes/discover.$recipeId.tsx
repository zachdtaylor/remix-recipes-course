import { LoaderArgs, json } from "@remix-run/node";
import db from "~/db.server";

export async function loader({ params }: LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
  });

  if (recipe === null) {
    throw json(
      {
        message: `A recipe with id ${params.id} does not exist.`,
      },
      { status: 404 }
    );
  }

  return json({ recipe });
}
