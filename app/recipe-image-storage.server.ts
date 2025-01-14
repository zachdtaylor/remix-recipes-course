import { LocalFileStorage } from "@mjackson/file-storage/local";

export const fileStorage = new LocalFileStorage("recipe-images");

export function getStorageKey(recipeId: string) {
  return `recipe-${recipeId}-image`;
}
