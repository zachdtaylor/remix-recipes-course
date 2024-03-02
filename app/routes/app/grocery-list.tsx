import { useFetcher } from "react-router";
import { CheckCircleIcon } from "~/components/icons";
import db from "~/db.server";
import { requireLoggedInUser } from "~/utils/auth.server";
import { Route } from "./+types/grocery-list";

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

export async function loader({ request }: Route.LoaderArgs) {
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
}

function GroceryListItem({ item }: { item: GroceryListItem }) {
  const fetcher = useFetcher();

  return fetcher.state !== "idle" ? null : (
    <div className="shadow-md rounded-md p-4 flex">
      <div className="flex-grow">
        <h1 className="text-sm font-bold mb-2 uppercase">{item.name}</h1>
        <ul>
          {item.uses.map((itemUse) => (
            <li key={itemUse.id} className="py-1">
              {itemUse.amount} for {itemUse.recipeName} (x{itemUse.multiplier})
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
