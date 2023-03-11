import { useFetcher } from "react-router";
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
  return <div></div>;
}

export default function GroceryList() {
  return <div>Grocery List</div>;
}
