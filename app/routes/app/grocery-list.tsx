import { useFetcher } from "@remix-run/react";
import { CheckCircleIcon } from "~/components/icons";

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
