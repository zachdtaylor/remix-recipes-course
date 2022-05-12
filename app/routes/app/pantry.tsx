import { PantryShelf, PrismaClient } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const db = new PrismaClient();
  const shelves = await db.pantryShelf.findMany();
  return json({ shelves });
};

export default function Pantry() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Welcome to the pantry :)</h1>
      <ul>
        {data.shelves.map((shelf: PantryShelf) => (
          <li key={shelf.id}>{shelf.name}</li>
        ))}
      </ul>
    </div>
  );
}
