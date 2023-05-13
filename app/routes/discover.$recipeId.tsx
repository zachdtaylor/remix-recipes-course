import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover";
import db from "~/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          name: true,
          amount: true,
        },
      },
    },
  });

  if (recipe === null) {
    throw json(
      {
        message: `A recipe with id ${params.id} does not exist.`,
      },
      { status: 404 }
    );
  }

  return json({ recipe });
}

export default function DiscoverRecipe() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="md:h-[calc(100vh-1rem)] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={data.recipe} />
      <DiscoverRecipeDetails recipe={data.recipe} />
    </div>
  );
}
