import { fileStorage, getStorageKey } from "~/recipe-image-storage.server";
import { Route } from "./+types/recipe-image";

export async function loader({ params }: Route.LoaderArgs) {
  const storageKey = getStorageKey(params.recipeId);
  const file = await fileStorage.get(storageKey);

  if (!file) {
    throw new Response("Recipe image not found", {
      status: 404,
    });
  }

  return new Response(file.stream(), {
    headers: {
      "Content-Type": file.type,
    },
  });
}
