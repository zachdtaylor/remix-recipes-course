import { ShouldRevalidateFunctionArgs } from "react-router";

export function mealPlanModalIsOpeningOrClosing(
  arg: ShouldRevalidateFunctionArgs
) {
  const modalIsOpening = arg.nextUrl.pathname.endsWith("update-meal-plan");
  const modalIsClosing = arg.currentUrl.pathname.endsWith("update-meal-plan");

  if (modalIsOpening) return true;

  if (modalIsClosing && typeof arg.formData === "undefined") return true;

  return false;
}
