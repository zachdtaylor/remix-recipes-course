import { useFetcher } from "react-router";

export function useSaveRecipeNameFetcher<T>(id: string) {
  return useFetcher<T>({ key: `save-recipe-name-${id}` });
}

export function useSaveRecipeTotalTimeFetcher<T>(id: string) {
  return useFetcher<T>({ key: `save-recipe-total-time-${id}` });
}
