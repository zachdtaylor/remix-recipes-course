import { Form, Link } from "@remix-run/react";
import ReactModal from "react-modal";
import { DeleteButton, IconInput, PrimaryButton } from "~/components/forms";
import { XIcon } from "~/components/icons";

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

export default function UpdateMealPlanModal() {
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
          <h2 className="mb-2">Recipe Name</h2>
          <IconInput
            icon={<XIcon />}
            defaultValue={1}
            type="number"
            autoComplete="off"
            name="mealPlanMultiplier"
          />
          <div className="flex justify-end gap-4 mt-8">
            <DeleteButton name="_action" value="removeFromMealPlan">
              Remove from Meal Plan
            </DeleteButton>
            <PrimaryButton name="_action" value="updateMealPlan">
              Save
            </PrimaryButton>
          </div>
        </Form>
      </div>
    </ReactModal>
  );
}
