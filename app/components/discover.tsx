import { Link } from "@remix-run/react";
import { classNames } from "~/utils/misc";
import { TimeIcon } from "./icons";

export function DiscoverGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </ul>
  );
}

type DiscoverListItemProps = {
  recipe: {
    id: string;
    imageUrl: string;
    name: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
};
export function DiscoverListItem({ recipe }: DiscoverListItemProps) {
  return (
    <li
      key={recipe.id}
      className="shadow-md rounded-md hover:text-primary group"
    >
      <Link to={recipe.id} className="flex flex-col h-full">
        <div className="h-48 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={`recipe named ${recipe.name}`}
            className="h-full w-full object-cover rounded-t-md"
          />
        </div>
        <div
          className={classNames(
            "p-4 rounded-b-md border-b-2 border-x-2 flex-grow border-background",
            "group-hover:border-primary"
          )}
        >
          <h1 className="font-bold text-xl pb-2">{recipe.name}</h1>
          <h2>{`${recipe.user.firstName} ${recipe.user.lastName}`}</h2>
        </div>
      </Link>
    </li>
  );
}

type DiscoverRecipeHeaderProps = {
  recipe: {
    imageUrl: string;
    name: string;
    totalTime: string;
  };
};
export function DiscoverRecipeHeader({ recipe }: DiscoverRecipeHeaderProps) {
  return (
    <div className="relative">
      <img
        src={recipe.imageUrl}
        alt={`recipe named ${recipe.name}`}
        className="h-44 w-full object-cover"
      />
      <div
        className={classNames(
          "absolute top-0 left-0 w-full h-full bg-[rgba(255,255,255,0.8)]",
          "flex flex-col justify-center p-4"
        )}
      >
        <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
        <div className="flex font-light text-gray-900">
          <TimeIcon />
          <p className="pl-2">{recipe.totalTime}</p>
        </div>
      </div>
    </div>
  );
}

type DiscoverRecipeDetailsProps = {
  recipe: {
    ingredients: Array<{ id: string; amount: string | null; name: string }>;
    instructions: string;
  };
};
export function DiscoverRecipeDetails({ recipe }: DiscoverRecipeDetailsProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Ingredients</h2>
      <ul className="py-4">
        {recipe.ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="py-1"
          >{`${ingredient.amount?.trim()} ${ingredient.name.trim()}`}</li>
        ))}
      </ul>
      <h2 className="text-xl font-bold pb-4">Instructions</h2>
      {recipe.instructions.split("\n").map((paragraph, idx) =>
        paragraph === "" ? null : (
          <p key={idx} className="pb-6">
            {paragraph}
          </p>
        )
      )}
    </div>
  );
}
