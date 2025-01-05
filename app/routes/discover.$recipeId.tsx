import { data } from "react-router";
import { useLoaderData } from "react-router";
import {
  DiscoverRecipeDetails,
  DiscoverRecipeHeader,
} from "~/components/discover";
import db from "~/db.server";
import { getCurrentUser } from "~/utils/auth.server";
import { hash } from "~/utils/cryptography.server";
import { Route } from "./+types/discover.$recipeId";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    etag: loaderHeaders.get("etag"),
    "Cache-Control": `max-age=5, stale-while-revalidate=60`,
  };
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: {
      ingredients: {
        select: {
          id: true,
          name: true,
          amount: true,
        },
      },
    },
  });

  if (recipe === null) {
    throw data(
      {
        message: `A recipe with id ${params.id} does not exist.`,
      },
      { status: 404 }
    );
  }

  const user = await getCurrentUser(request);
  const hashedUserId = hash(user?.id ?? "anonymous");
  const hashedRecipe = hash(JSON.stringify(recipe));
  const etag = `${hashedUserId}.${hashedRecipe}`;

  return data({ recipe }, { headers: { etag } });
}

export default function DiscoverRecipe() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="md:h-[calc(100vh-1rem)] m-[-1rem] overflow-auto">
      <DiscoverRecipeHeader recipe={data.recipe} />
      <DiscoverRecipeDetails recipe={data.recipe} />
    </div>
  );
}
