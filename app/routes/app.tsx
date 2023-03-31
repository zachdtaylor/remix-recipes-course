import { PageLayout } from "~/components/layout";

export default function App() {
  return (
    <PageLayout
      title="App"
      links={[
        { to: "recipes", label: "Recipes" },
        { to: "pantry", label: "Pantry" },
        { to: "grocery-list", label: "Grocery List" },
      ]}
    />
  );
}
