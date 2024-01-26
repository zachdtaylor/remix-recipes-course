import db from "~/db.server";
import { Route } from "./+types/$recipeId";
import { data, Form, useLoaderData } from "react-router";
import { ErrorMessage, Input } from "~/components/form";
import { TimeIcon, TrashIcon } from "~/components/icons";
import React from "react";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

export async function loader({ params }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          amount: true,
          name: true,
        },
      },
    },
  });

  return data({ recipe }, { headers: { "Cache-Control": "max-age=5" } });
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
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientAmount"
                defaultValue={ingredient.amount ?? ""}
              />
              <ErrorMessage></ErrorMessage>
            </div>
            <div>
              <Input
                type="text"
                autoComplete="off"
                name="ingredientName"
                defaultValue={ingredient.name}
              />
              <ErrorMessage></ErrorMessage>
            </div>
            <button>
              <TrashIcon />
            </button>
          </React.Fragment>
        ))}
      </div>
    </Form>
  );
}
