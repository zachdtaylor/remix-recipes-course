import { json, LoaderFunctionArgs } from "@remix-run/node";
import db from "~/db.server";
import { requireLoggedInUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireLoggedInUser(request);

  const recipes = await db.recipe.findMany({
    where: { userId: user.id },
    select: { name: true, totalTime: true, imageUrl: true, id: true },
  });

  return json({ recipes });
}

export default function Recipes() {
  return <div>Recipes</div>;
}
