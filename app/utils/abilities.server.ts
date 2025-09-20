import { data } from "react-router";
import db from "~/db.server";
import { type User } from "@prisma/client";

export async function canChangeRecipe(user: User, recipeId: string) {
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });

  if (recipe === null) {
    throw data(
      { message: "A recipe with that id does not exist" },
      { status: 404 },
    );
  }

  if (recipe.userId !== user.id) {
    throw data(
      { message: "You are not authorized to make changes this recipe" },
      { status: 401 },
    );
  }
}
