import { requireLoggedInUser } from "~/utils/auth.server";
import { Route } from "./+types/recipes";
import db from "~/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireLoggedInUser(request);

  const recipes = await db.recipe.findMany({
    where: { userId: user.id },
    select: { name: true, totalTime: true, imageUrl: true, id: true },
  });

  return { recipes };
}

export default function Recipes() {
  return <div>Recipes</div>;
}
