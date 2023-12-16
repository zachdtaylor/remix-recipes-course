import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const db = new PrismaClient();
  const shelves = await db.pantryShelf.findMany();
  return json({ shelves });
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
