import { PrismaClient } from "@prisma/client";
import { useLoaderData } from "react-router";

export async function loader() {
  const db = new PrismaClient();
  const shelves = await db.pantryShelf.findMany();
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
