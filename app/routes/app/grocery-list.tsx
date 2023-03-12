import { LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { CheckCircleIcon } from "~/components/icons";
import db from "~/db.server";
import { requireLoggedInUser } from "~/utils/auth.server";

type GroceryListItem = {
  id: string;
  name: string;
  uses: Array<{
    id: string;
    amount: string | null;
    recipeName: string;
    multiplier: number;
  }>;
};

function isMatch(ingredientName: string, pantryItemName: string) {
  const lowerIngredientName = ingredientName.toLowerCase();
  const lowerPantryItemName = pantryItemName.toLowerCase();
  return lowerIngredientName === lowerPantryItemName;
}

export async function loader({ request }: LoaderArgs) {
  const user = await requireLoggedInUser(request);

  const ingredients = await db.ingredient.findMany({
    where: {
      recipe: {
        userId: user.id,
        mealPlanMultiplier: {
          not: null,
        },
      },
    },
    include: {
      recipe: {
        select: {
          name: true,
          mealPlanMultiplier: true,
        },
      },
    },
  });

  const pantryItems = await db.pantryItem.findMany({
    where: { userId: user.id },
  });

  const missingIngredients = ingredients.filter(
    (ingredient) =>
      !pantryItems.find((pantryItem) =>
        isMatch(ingredient.name, pantryItem.name)
      )
  );

  const groceryListItems = missingIngredients.reduce<{
    [key: string]: GroceryListItem;
  }>((groceryListItemsMapSoFar, ingredient) => {
    if (ingredient.recipe.mealPlanMultiplier === null) {
      throw new Error("multiplier was unexpectedly null");
    }
    const ingredientName = ingredient.name.toLowerCase();
    const existing = groceryListItemsMapSoFar[ingredientName] ?? { uses: [] };
    return {
      ...groceryListItemsMapSoFar,
      [ingredientName]: {
        id: ingredient.id,
        name: ingredientName,
        uses: [
          ...existing.uses,
          {
            id: ingredient.recipeId,
            amount: ingredient.amount,
            recipeName: ingredient.recipe.name,
            multiplier: ingredient.recipe.mealPlanMultiplier,
          },
        ],
      },
    };
  }, {});

  return { groceryList: Object.values(groceryListItems) };
}

function GroceryListItem({ item }: { item: GroceryListItem }) {
  const fetcher = useFetcher();

  return fetcher.state !== "idle" ? null : (
    <div className="shadow-md rounded-md p-4 flex">
      <div className="flex-grow">
        <h1 className="text-sm font-bold mb-2 uppercase">{item.name}</h1>
        <ul>
          {item.uses.map((use) => (
            <li key={use.id} className="py-1">
              {use.amount} for {use.recipeName} (x{use.multiplier})
            </li>
          ))}
        </ul>
      </div>
      <fetcher.Form method="post" className="flex flex-col justify-center">
        <button
          name="_action"
          value="checkOffItem"
          className="hover:text-primary"
        >
          <CheckCircleIcon />
        </button>
      </fetcher.Form>
    </div>
  );
}

export default function GroceryList() {
  return <div>Grocery List</div>;
}