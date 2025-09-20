import ReactModal from "react-modal";
import { Form, Link, useActionData, data, redirect } from "react-router";
import { z } from "zod";
import {
  DeleteButton,
  ErrorMessage,
  IconInput,
  PrimaryButton,
} from "~/components/forms";
import { XIcon } from "~/components/icons";
import db from "~/db.server";
import { canChangeRecipe } from "~/utils/abilities.server";
import { classNames } from "~/utils/misc";
import { validateForm } from "~/utils/validation";
import { useRecipeContext } from "../$recipeId";
import { Route } from "./+types/update-meal-plan";
import { userContext } from "~/context";

const updateMealPlanSchema = z.object({
  mealPlanMultiplier: z.preprocess(
    (value) => parseInt(String(value)),
    z.number().min(1),
  ),
});
export async function action({ context, request, params }: Route.ActionArgs) {
  const user = context.get(userContext);
  const recipeId = String(params.recipeId);
  await canChangeRecipe(user, recipeId);

  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "updateMealPlan": {
      return validateForm(
        formData,
        updateMealPlanSchema,
        async ({ mealPlanMultiplier }) => {
          await db.recipe.update({
            where: { id: recipeId },
            data: { mealPlanMultiplier },
          });
          return redirect("..");
        },
        (errors) => data({ errors }, { status: 400 }),
      );
    }
    case "removeFromMealPlan": {
      await db.recipe.update({
        where: { id: recipeId },
        data: { mealPlanMultiplier: null },
      });
      return redirect("..");
    }
    default: {
      return null;
    }
  }
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

export default function UpdateMealPlanModal() {
  const { recipeName, mealPlanMultiplier } = useRecipeContext();
  const actionData = useActionData<typeof action>();
  return (
    <ReactModal
      isOpen
      className={classNames(
        "m-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]",
        "md:h-fit lg:w-1/2 md:mx-auto md:mt-24",
      )}
    >
      <div className="p-4 rounded-md bg-white shadow-md">
        <div className="flex justify-between mb-8">
          <h1 className="text-lg font-bold">Update Meal Plan</h1>
          <Link to="..">
            <XIcon />
          </Link>
        </div>
        <Form method="post" reloadDocument>
          <h2 className="mb-2">{recipeName}</h2>
          <IconInput
            icon={<XIcon />}
            defaultValue={mealPlanMultiplier ?? 1}
            type="number"
            autoComplete="off"
            name="mealPlanMultiplier"
          />
          <ErrorMessage>{actionData?.errors?.mealPlanMultiplier}</ErrorMessage>
          <div className="flex justify-end gap-4 mt-8">
            {mealPlanMultiplier !== null ? (
              <DeleteButton name="_action" value="removeFromMealPlan">
                Remove from Meal Plan
              </DeleteButton>
            ) : null}
            <PrimaryButton name="_action" value="updateMealPlan">
              Save
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </ReactModal>
  );
}
