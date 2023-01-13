import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import { z } from "zod";
import {
  DeleteButton,
  ErrorMessage,
  Input,
  PrimaryButton,
} from "~/components/forms";
import { SaveIcon, TimeIcon, TrashIcon } from "~/components/icons";
import db from "~/db.server";
import { classNames } from "~/utils/misc";
import { validateForm } from "~/utils/validation";

export async function loader({ params }: LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          amount: true,
          name: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return json({ recipe }, { headers: { "Cache-Control": "max-age=10" } });
}

const saveRecipeSchema = z
  .object({
    name: z.string().min(1, "Name cannot be blank"),
    totalTime: z.string().min(1, "Total time cannot be blank"),
    instructions: z.string().min(1, "Instructions cannot be blank"),
    ingredientIds: z
      .array(z.string().min(1, "Ingredient ID is missing"))
      .optional(),
    ingredientAmounts: z.array(z.string().nullable()).optional(),
    ingredientNames: z
      .array(z.string().min(1, "Name cannot be blank"))
      .optional(),
  })
  .refine(
    (data) =>
      data.ingredientIds?.length === data.ingredientAmounts?.length &&
      data.ingredientIds?.length === data.ingredientNames?.length,
    { message: "Ingredient arrays must all be the same length" }
  );

const createIngredientSchema = z.object({
  newIngredientAmount: z.string().nullable(),
  newIngredientName: z.string().min(1, "Name cannot be blank"),
});

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const recipeId = String(params.recipeId);

  switch (formData.get("_action")) {
    case "saveRecipe": {
      return validateForm(
        formData,
        saveRecipeSchema,
        ({ ingredientIds, ingredientNames, ingredientAmounts, ...data }) =>
          db.recipe.update({
            where: { id: recipeId },
            data: {
              ...data,
              ingredients: {
                updateMany: ingredientIds?.map((id, index) => ({
                  where: { id },
                  data: {
                    amount: ingredientAmounts?.[index],
                    name: ingredientNames?.[index],
                  },
                })),
              },
            },
          }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "createIngredient": {
      return validateForm(
        formData,
        createIngredientSchema,
        ({ newIngredientAmount, newIngredientName }) =>
          db.ingredient.create({
            data: {
              recipeId,
              amount: newIngredientAmount,
              name: newIngredientName,
            },
          }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    default: {
      return null;
    }
  }
}

export default function RecipeDetail() {
  const data = useLoaderData<typeof loader>();

  return (
    <Form method="post" reloadDocument>
      <div className="mb-2">
        <Input
          key={data.recipe?.id}
          type="text"
          placeholder="Recipe Name"
          autoComplete="off"
          className="text-2xl font-extrabold"
          name="name"
          defaultValue={data.recipe?.name}
        />
        <ErrorMessage></ErrorMessage>
      </div>
      <div className="flex">
        <TimeIcon />
        <div className="ml-2 flex-grow">
          <Input
            key={data.recipe?.id}
            type="text"
            placeholder="Time"
            autoComplete="off"
            name="totalTime"
            defaultValue={data.recipe?.totalTime}
          />
          <ErrorMessage></ErrorMessage>
        </div>
      </div>
      <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
        <h2 className="font-bold text-sm pb-1">Amount</h2>
        <h2 className="font-bold text-sm pb-1">Name</h2>
        <div></div>
        {data.recipe?.ingredients.map((ingredient) => (
          <React.Fragment key={ingredient.id}>
            <input type="hidden" name="ingredientIds[]" value={ingredient.id} />
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientAmounts[]"
                defaultValue={ingredient.amount ?? ""}
              />
              <ErrorMessage></ErrorMessage>
            </div>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientNames[]"
                defaultValue={ingredient.name}
              />
              <ErrorMessage></ErrorMessage>
            </div>
            <button>
              <TrashIcon />
            </button>
          </React.Fragment>
        ))}
        <div>
          <Input
            type="text"
            autoComplete="off"
            name="newIngredientAmount"
            className="border-b-gray-200"
          />
          <ErrorMessage></ErrorMessage>
        </div>
        <div>
          <Input
            type="text"
            autoComplete="off"
            name="newIngredientName"
            className="border-b-gray-200"
          />
          <ErrorMessage></ErrorMessage>
        </div>
        <button name="_action" value="createIngredient">
          <SaveIcon />
        </button>
      </div>
      <label
        htmlFor="instructions"
        className="block font-bold text-sm pb-2 w-fit"
      >
        Instructions
      </label>
      <textarea
        key={data.recipe?.id}
        id="instructions"
        name="instructions"
        placeholder="Instructions go here"
        defaultValue={data.recipe?.instructions}
        className={classNames(
          "w-full h-56 rounded-md outline-none",
          "focus:border-2 focus:p-3 focus:border-primary duration-300"
        )}
      />
      <ErrorMessage></ErrorMessage>
      <hr className="my-4" />
      <div className="flex justify-between">
        <DeleteButton>Delete this Recipe</DeleteButton>
        <PrimaryButton name="_action" value="saveRecipe">
          <div className="flex flex-col justify-center h-full">Save</div>
        </PrimaryButton>
      </div>
    </Form>
  );
}
