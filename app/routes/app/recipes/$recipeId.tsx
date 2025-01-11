import db from "~/db.server";
import { Route } from "./+types/$recipeId";
import {
  data,
  Form,
  isRouteErrorResponse,
  redirect,
  useActionData,
  useLoaderData,
  useRouteError,
} from "react-router";
import {
  DeleteButton,
  ErrorMessage,
  Input,
  PrimaryButton,
} from "~/components/form";
import { SaveIcon, TimeIcon, TrashIcon } from "~/components/icons";
import React from "react";
import classNames from "classnames";
import { z } from "zod";
import { validateForm } from "~/utils/validation";
import { handleDelete } from "~/models/utils";
import { requireLoggedInUser } from "~/utils/auth.server";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireLoggedInUser(request);
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

  if (recipe === null) {
    throw data(
      { message: "A recipe with that id does not exist" },
      { status: 404 }
    );
  }

  if (recipe.userId !== user.id) {
    throw data(
      { message: "You are not authorized to view this recipe" },
      { status: 401 }
    );
  }

  return data({ recipe }, { headers: { "Cache-Control": "max-age=5" } });
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

function actionData<T, E>(data: T, errors?: E) {
  return { data, errors };
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireLoggedInUser(request);
  const recipeId = params.recipeId;
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });

  if (recipe === null) {
    throw data(
      { message: "A recipe with that id does not exist" },
      { status: 404 }
    );
  }

  if (recipe.userId !== user.id) {
    throw data(
      { message: "You are not authorized to make changes this recipe" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const _action = formData.get("_action");

  if (typeof _action === "string" && _action.includes("deleteIngredient")) {
    const ingredientId = _action.split(".")[1];
    return actionData(
      handleDelete(() => db.ingredient.delete({ where: { id: ingredientId } }))
    );
  }

  switch (_action) {
    case "saveRecipe": {
      return validateForm(
        formData,
        saveRecipeSchema,
        ({ ingredientIds, ingredientNames, ingredientAmounts, ...data }) =>
          actionData(
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
            })
          ),
        (errors) => data(actionData(null, errors), { status: 400 })
      );
    }
    case "createIngredient": {
      return validateForm(
        formData,
        createIngredientSchema,
        ({ newIngredientAmount, newIngredientName }) =>
          actionData(
            db.ingredient.create({
              data: {
                recipeId,
                amount: newIngredientAmount,
                name: newIngredientName,
              },
            })
          ),
        (errors) => data(actionData(null, errors), { status: 400 })
      );
    }
    case "deleteRecipe": {
      await handleDelete(() => db.recipe.delete({ where: { id: recipeId } }));
      return redirect("/app/recipes");
    }
    default: {
      return actionData(null);
    }
  }
}

export default function RecipeDetail() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const actionDataErrors = actionData?.errors;

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
          error={!!actionDataErrors?.name}
        />
        <ErrorMessage>{actionDataErrors?.name}</ErrorMessage>
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
            error={!!actionDataErrors?.totalTime}
          />
          <ErrorMessage>{actionDataErrors?.totalTime}</ErrorMessage>
        </div>
      </div>
      <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
        <h2 className="font-bold text-sm pb-1">Amount</h2>
        <h2 className="font-bold text-sm pb-1">Name</h2>
        <div></div>
        {data.recipe?.ingredients.map((ingredient, idx) => (
          <React.Fragment key={ingredient.id}>
            <input type="hidden" name="ingredientIds[]" value={ingredient.id} />
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientAmounts[]"
                defaultValue={ingredient.amount ?? ""}
                error={!!actionDataErrors?.[`ingredientAmounts.${idx}`]}
              />
              <ErrorMessage>
                {actionDataErrors?.[`ingredientAmounts.${idx}`]}
              </ErrorMessage>
            </div>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientNames[]"
                defaultValue={ingredient.name}
                error={!!actionDataErrors?.[`ingredientNames.${idx}`]}
              />
              <ErrorMessage>
                {actionDataErrors?.[`ingredientNames.${idx}`]}
              </ErrorMessage>
            </div>
            <button name="_action" value={`deleteIngredient.${ingredient.id}`}>
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
            error={!!actionDataErrors?.newIngredientAmount}
          />
          <ErrorMessage>{actionDataErrors?.newIngredientAmount}</ErrorMessage>
        </div>
        <div>
          <Input
            type="text"
            autoComplete="off"
            name="newIngredientName"
            className="border-b-gray-200"
            error={!!actionDataErrors?.newIngredientName}
          />
          <ErrorMessage>{actionDataErrors?.newIngredientName}</ErrorMessage>
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
          "focus:border-2 focus:p-3 focus:border-primary duration-300",
          actionDataErrors?.instructions ? "border-2 border-red-500 p-3" : ""
        )}
      />
      <ErrorMessage>{actionDataErrors?.instructions}</ErrorMessage>
      <hr className="my-4" />
      <div className="flex justify-between">
        <DeleteButton name="_action" value="deleteRecipe">
          Delete this Recipe
        </DeleteButton>
        <PrimaryButton name="_action" value="saveRecipe">
          <div className="flex flex-col justify-center h-full">Save</div>
        </PrimaryButton>
      </div>
    </Form>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="bg-red-600 text-white rounded-md p-4">
        <h1 className="mb-2">{error.status}</h1>
        <p>{error.data.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white rounded-md p-4">
      <h1 className="mb-2">An unexpected error occurred.</h1>
    </div>
  );
}
