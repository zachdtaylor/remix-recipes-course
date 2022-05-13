import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllShelves } from "~/models/pantry-shelf.server";

type LoaderData = {
  shelves: Awaited<ReturnType<typeof getAllShelves>>;
};

export const loader: LoaderFunction = async () => {
  const shelves = await getAllShelves();
  return json({ shelves });
};

export default function Pantry() {
  const data = useLoaderData() as LoaderData;
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
