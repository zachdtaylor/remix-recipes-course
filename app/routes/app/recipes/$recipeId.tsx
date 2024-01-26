import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { ErrorMessage, Input } from "~/components/forms";
import { TimeIcon } from "~/components/icons";
import db from "~/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const recipe = await db.recipe.findUnique({ where: { id: params.recipeId } });

  return json({ recipe }, { headers: { "Cache-Control": "max-age=10" } });
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
    </Form>
  );
}
