import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  isRouteErrorResponse,
  useActionData,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import classNames from "classnames";
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
import { handleDelete } from "~/models/utils";
import { requireLoggedInUser } from "~/utils/auth.server";
import { useDebouncedFunction, useServerLayoutEffect } from "~/utils/misc";
import { validateForm } from "~/utils/validation";

export async function loader({ request, params }: LoaderFunctionArgs) {
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
    throw json(
      { message: "A recipe with that id does not exist" },
      { status: 404 }
    );
  }

  if (recipe.userId !== user.id) {
    throw json(
      { message: "You are not authorized to view this recipe" },
      { status: 401 }
    );
  }

  return json({ recipe }, { headers: { "Cache-Control": "max-age=10" } });
}

const saveNameSchema = z.object({
  name: z.string().min(1, "Name cannot be blank"),
});

const saveTotalTimeSchema = z.object({
  totalTime: z.string().min(1, "Total time cannot be blank"),
});

const saveInstructionsSchema = z.object({
  instructions: z.string().min(1, "Instructions cannot be blank"),
});

const ingredientId = z.string().min(1, "Ingredient ID is missing");

const ingredientAmount = z.string().nullable();

const ingredientName = z.string().min(1, "Name cannot be blank");

const saveIngredientAmountSchema = z.object({
  amount: ingredientAmount,
  id: ingredientId,
});

const saveIngredientNameSchema = z.object({
  name: ingredientName,
  id: ingredientId,
});

const saveRecipeSchema = z
  .object({
    imageUrl: z.string().optional(),
    ingredientIds: z.array(ingredientId).optional(),
    ingredientAmounts: z.array(ingredientAmount).optional(),
    ingredientNames: z.array(ingredientName).optional(),
  })
  .and(saveNameSchema)
  .and(saveTotalTimeSchema)
  .and(saveInstructionsSchema)
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

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireLoggedInUser(request);
  const recipeId = String(params.recipeId);
  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });

  if (recipe === null) {
    throw json(
      { message: "A recipe with that id does not exist" },
      { status: 404 }
    );
  }

  if (recipe.userId !== user.id) {
    throw json(
      { message: "You are not authorized to make changes this recipe" },
      { status: 401 }
    );
  }

  let formData;
  if (request.headers.get("Content-Type")?.includes("multipart/form-data")) {
    const uploadHandler = unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({ directory: "public/images" }),
      unstable_createMemoryUploadHandler()
    );
    formData = await unstable_parseMultipartFormData(request, uploadHandler);
    const image = formData.get("image") as File;
    if (image.size !== 0) {
      formData.set("imageUrl", `/images/${image.name}`);
    }
  } else {
    formData = await request.formData();
  }
  const _action = formData.get("_action");

  if (typeof _action === "string" && _action.includes("deleteIngredient")) {
    const ingredientId = _action.split(".")[1];
    return handleDelete(() =>
      db.ingredient.delete({ where: { id: ingredientId } })
    );
  }

  switch (_action) {
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
    case "deleteRecipe": {
      await handleDelete(() => db.recipe.delete({ where: { id: recipeId } }));
      return redirect("/app/recipes");
    }
    case "saveName": {
      return validateForm(
        formData,
        saveNameSchema,
        (data) => db.recipe.update({ where: { id: recipeId }, data }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "saveTotalTime": {
      return validateForm(
        formData,
        saveTotalTimeSchema,
        (data) => db.recipe.update({ where: { id: recipeId }, data }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "saveInstructions": {
      return validateForm(
        formData,
        saveInstructionsSchema,
        (data) => db.recipe.update({ where: { id: recipeId }, data }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "saveIngredientAmount": {
      return validateForm(
        formData,
        saveIngredientAmountSchema,
        ({ id, amount }) =>
          db.ingredient.update({ where: { id }, data: { amount } }),
        (errors) => json({ errors }, { status: 400 })
      );
    }
    case "saveIngredientName": {
      return validateForm(
        formData,
        saveIngredientNameSchema,
        ({ id, name }) =>
          db.ingredient.update({ where: { id }, data: { name } }),
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
  const actionData = useActionData<any>();
  const saveNameFetcher = useFetcher<any>();
  const saveTotalTimeFetcher = useFetcher<any>();
  const saveInstructionsFetcher = useFetcher<any>();
  const createIngredientFetcher = useFetcher<any>();
  const newIngredientAmountRef = React.useRef<HTMLInputElement>(null);

  const { renderedIngredients, addIngredient } = useOptimisticIngredients(
    data.recipe.ingredients,
    createIngredientFetcher.state
  );

  const [createIngredientForm, setCreateIngredientForm] = React.useState({
    amount: "",
    name: "",
  });

  const saveName = useDebouncedFunction(
    (name: string) =>
      saveNameFetcher.submit({ _action: "saveName", name }, { method: "post" }),
    1000
  );

  const saveTotalTime = useDebouncedFunction(
    (totalTime: string) =>
      saveTotalTimeFetcher.submit(
        { _action: "saveTotalTime", totalTime },
        { method: "post" }
      ),
    1000
  );

  const saveInstructions = useDebouncedFunction(
    (instructions: string) =>
      saveInstructionsFetcher.submit(
        { _action: "saveInstructions", instructions },
        { method: "post" }
      ),
    1000
  );

  const createIngredient = () => {
    addIngredient(createIngredientForm.amount, createIngredientForm.name);
    createIngredientFetcher.submit(
      {
        _action: "createIngredient",
        newIngredientAmount: createIngredientForm.amount,
        newIngredientName: createIngredientForm.name,
      },
      { method: "post" }
    );
    setCreateIngredientForm({ amount: "", name: "" });
    newIngredientAmountRef.current?.focus();
  };

  return (
    <>
      <Outlet />
      <Form method="post" encType="multipart/form-data" reloadDocument>
        <button name="_action" value="saveRecipe" className="hidden" />
        <div className="mb-2">
          <Input
            key={data.recipe?.id}
            type="text"
            placeholder="Recipe Name"
            autoComplete="off"
            className="text-2xl font-extrabold"
            name="name"
            defaultValue={data.recipe?.name}
            error={
              !!(
                saveNameFetcher?.data?.errors?.name || actionData?.errors?.name
              )
            }
            onChange={(e) => saveName(e.target.value)}
          />
          <ErrorMessage>
            {saveNameFetcher?.data?.errors?.name || actionData?.errors?.name}
          </ErrorMessage>
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
              error={
                !!(
                  saveTotalTimeFetcher?.data?.errors?.totalTime ||
                  actionData?.errors?.totalTime
                )
              }
              onChange={(e) => saveTotalTime(e.target.value)}
            />
            <ErrorMessage>
              {saveTotalTimeFetcher?.data?.errors?.totalTime ||
                actionData?.errors?.totalTime}
            </ErrorMessage>
          </div>
        </div>
        <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
          <h2 className="font-bold text-sm pb-1">Amount</h2>
          <h2 className="font-bold text-sm pb-1">Name</h2>
          <div></div>
          {renderedIngredients.map((ingredient, idx) => (
            <IngredientRow
              key={ingredient.id}
              id={ingredient.id}
              amount={ingredient.amount}
              name={ingredient.name}
              amountError={actionData?.errors?.[`ingredientAmounts.${idx}`]}
              nameError={actionData?.errors?.[`ingredientNames.${idx}`]}
              isOptimistic={ingredient.isOptimistic}
            />
          ))}
          <div>
            <Input
              ref={newIngredientAmountRef}
              type="text"
              autoComplete="off"
              name="newIngredientAmount"
              className="border-b-gray-200"
              error={
                !!(
                  createIngredientFetcher.data?.errors?.newIngredientAmount ??
                  actionData?.errors?.newIngredientAmount
                )
              }
              value={createIngredientForm.amount}
              onChange={(e) =>
                setCreateIngredientForm((values) => ({
                  ...values,
                  amount: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createIngredient();
                }
              }}
            />
            <ErrorMessage>
              {createIngredientFetcher.data?.errors?.newIngredientAmount ??
                actionData?.errors?.newIngredientAmount}
            </ErrorMessage>
          </div>
          <div>
            <Input
              type="text"
              autoComplete="off"
              name="newIngredientName"
              className="border-b-gray-200"
              error={
                !!(
                  createIngredientFetcher.data?.errors?.newIngredientName ??
                  actionData?.errors?.newIngredientName
                )
              }
              value={createIngredientForm.name}
              onChange={(e) =>
                setCreateIngredientForm((values) => ({
                  ...values,
                  name: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createIngredient();
                }
              }}
            />
            <ErrorMessage>
              {createIngredientFetcher.data?.errors?.newIngredientName ??
                actionData?.errors?.newIngredientName}
            </ErrorMessage>
          </div>
          <button
            name="_action"
            value="createIngredient"
            onClick={(e) => {
              e.preventDefault();
              createIngredient();
            }}
          >
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
            saveInstructionsFetcher?.data?.errors?.instructions ||
              actionData?.errors?.instructions
              ? "border-2 border-red-500 p-3"
              : ""
          )}
          onChange={(e) => saveInstructions(e.target.value)}
        />
        <ErrorMessage>
          {saveInstructionsFetcher?.data?.errors?.instructions ||
            actionData?.errors?.instructions}
        </ErrorMessage>
        <label
          htmlFor="image"
          className="block font-bold text-sm pb-2 w-fit mt-4"
        >
          Image
        </label>
        <input
          id="image"
          type="file"
          name="image"
          key={`${data.recipe?.id}.image`}
        />
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
    </>
  );
}

type IngredientRowProps = {
  id: string;
  amount: string | null;
  amountError?: string;
  name: string;
  nameError?: string;
  isOptimistic?: boolean;
};
function IngredientRow({
  id,
  amount,
  amountError,
  name,
  nameError,
  isOptimistic,
}: IngredientRowProps) {
  const saveAmountFetcher = useFetcher<any>();
  const saveNameFetcher = useFetcher<any>();
  const deleteIngredientFetcher = useFetcher<any>();

  const saveAmount = useDebouncedFunction(
    (amount: string) =>
      saveAmountFetcher.submit(
        {
          _action: "saveIngredientAmount",
          amount,
          id,
        },
        { method: "post" }
      ),
    1000
  );

  const saveName = useDebouncedFunction(
    (name: string) =>
      saveNameFetcher.submit(
        {
          _action: "saveIngredientName",
          name,
          id,
        },
        { method: "post" }
      ),
    1000
  );

  return deleteIngredientFetcher.state !== "idle" ? null : (
    <React.Fragment>
      <input type="hidden" name="ingredientIds[]" value={id} />
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="ingredientAmounts[]"
          defaultValue={amount ?? ""}
          error={!!(saveAmountFetcher.data?.errors?.amount ?? amountError)}
          onChange={(e) => saveAmount(e.target.value)}
          disabled={isOptimistic}
        />
        <ErrorMessage>
          {saveAmountFetcher.data?.errors?.amount ?? amountError}
        </ErrorMessage>
      </div>
      <div>
        <Input
          type="text"
          autoComplete="off"
          name="ingredientNames[]"
          defaultValue={name}
          error={!!(saveNameFetcher.data?.errors?.name ?? nameError)}
          onChange={(e) => saveName(e.target.value)}
          disabled={isOptimistic}
        />
        <ErrorMessage>
          {saveNameFetcher.data?.errors?.name ?? nameError}
        </ErrorMessage>
      </div>
      <button
        name="_action"
        value={`deleteIngredient.${id}`}
        onClick={(e) => {
          e.preventDefault();
          deleteIngredientFetcher.submit(
            {
              _action: `deleteIngredient.${id}`,
            },
            { method: "post" }
          );
        }}
      >
        <TrashIcon />
      </button>
    </React.Fragment>
  );
}

type RenderedIngredient = {
  id: string;
  name: string;
  amount: string | null;
  isOptimistic?: boolean;
};
function useOptimisticIngredients(
  savedIngredients: Array<RenderedIngredient>,
  createIngredientState: "idle" | "submitting" | "loading"
) {
  const [optimisticIngredients, setOptimisticIngredients] = React.useState<
    Array<RenderedIngredient>
  >([]);

  const renderedIngredients = [...savedIngredients, ...optimisticIngredients];

  useServerLayoutEffect(() => {
    if (createIngredientState === "idle") {
      setOptimisticIngredients([]);
    }
  }, [createIngredientState]);

  const addIngredient = (amount: string | null, name: string) => {
    setOptimisticIngredients((ingredients) => [
      ...ingredients,
      { id: createItemId(), name, amount, isOptimistic: true },
    ]);
  };

  return { renderedIngredients, addIngredient };
}

function createItemId() {
  return `${Math.round(Math.random() * 1_000_000)}`;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="bg-red-600 text-white rounded-md p-4">
        <h1 className="mb-2">
          {error.status} - {error.statusText}
        </h1>
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
