import { useLoaderData } from "react-router";
import { getAllShelves } from "~/models/pantry-shelf.server";

export async function loader() {
  const shelves = await getAllShelves();
  return { shelves };
}

export default function Pantry() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Welcome to the pantry :)</h1>
      <ul>
        {data.shelves.map((shelf) => (
          <li key={shelf.id}>{shelf.name}</li>
        ))}
      </ul>
    </div>
  );
}
