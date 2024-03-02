import { Form, Link, useActionData } from "@remix-run/react";
import ReactModal from "react-modal";
import {
  DeleteButton,
  ErrorMessage,
  IconInput,
  PrimaryButton,
} from "~/components/forms";
import { XIcon } from "~/components/icons";
import { useRecipeContext } from "../$recipeId";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { canChangeRecipe } from "~/utils/abilites.server";
import { z } from "zod";
import { validateForm } from "~/utils/validation";
import db from "~/db.server";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

const updateMealPlanSchema = z.object({
  mealPlanMultiplier: z.coerce.number().min(1),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const recipeId = String(params.recipeId);
  await canChangeRecipe(request, recipeId);

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
        (errors) => json({ errors }, { status: 400 })
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

export default function UpdateMealPlanModal() {
  const { recipeName, mealPlanMultiplier } = useRecipeContext();
  const actionData = useActionData<any>();
  return (
    <ReactModal isOpen className="md:h-fit lg:w-1/2 md:mx-auto md:mt-24">
      <div className="p-4 rounded-md bg-white shadow-md">
        <div className="flex justify-between mb-8">
          <h1 className="text-lg font-bold">Update Meal Plan</h1>
          <Link to=".." replace>
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
