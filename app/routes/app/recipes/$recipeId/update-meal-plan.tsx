import { Dialog } from "@reach/dialog";
import { ActionArgs, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { DeleteButton, IconInput, PrimaryButton } from "~/components/forms";
import { XIcon } from "~/components/icons";
import db from "~/db.server";
import { canChangeRecipe } from "~/utils/abilities.server";
import { classNames } from "~/utils/misc";
import { useRecipeContext } from "../$recipeId";

export async function action({ request, params }: ActionArgs) {
  const recipeId = String(params.recipeId);
  await canChangeRecipe(request, recipeId);

  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "updateMealPlan": {
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
  return (
    <Dialog
      isOpen
      className={classNames(
        "rounded-md p-4 m-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]",
        "md:h-fit lg:w-1/2 md:mx-auto md:mt-24"
      )}
    >
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
    </Dialog>
  );
}
