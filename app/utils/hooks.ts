import { useFetcher } from "@remix-run/react";

export function useSaveRecipeNameFetcher(id: string | undefined) {
  return useFetcher<any>({ key: `save-recipe-name-${id}` });
}

export function useSaveRecipeTotalTimeFetcher(id: string | undefined) {
  return useFetcher<any>({ key: `save-recipe-total-time-${id}` });
}
