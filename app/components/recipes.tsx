import { useParams } from "@remix-run/react";
import { classNames } from "~/utils/misc";
import { TimeIcon } from "./icons";

type RecipePageWrapperProps = {
  children: React.ReactNode;
};
export function RecipePageWrapper({ children }: RecipePageWrapperProps) {
  return <div className="lg:flex h-full">{children}</div>;
}

type RecipeListWrapperProps = {
  children: React.ReactNode;
};
export function RecipeListWrapper({ children }: RecipeListWrapperProps) {
  const params = useParams();
  return (
    <div
      className={classNames(
        "lg:block lg:w-1/3 lg:pr-4 overflow-auto",
        params.id ? "hidden" : ""
      )}
    >
      {children}
      <br />
    </div>
  );
}

type RecipeDetailWrapperProps = {
  children: React.ReactNode;
};
export function RecipeDetailWrapper({ children }: RecipeDetailWrapperProps) {
  return <div className="lg:w-2/3 overflow-auto pr-4 pl-4">{children}</div>;
}

type RecipeCardProps = {
  name: string;
  totalTime: string;
  imageUrl?: string;
  isActive?: boolean;
  isLoading?: boolean;
};
export function RecipeCard({
  name,
  totalTime,
  imageUrl,
  isActive,
  isLoading,
}: RecipeCardProps) {
  return (
    <div
      className={classNames(
        "group flex shadow-md rounded-md border-2",
        "hover:text-primary hover:border-primary",
        isActive ? "border-primary text-primary" : "border-white",
        isLoading ? "border-gray-500 text-gray-500" : ""
      )}
    >
      <div className="w-14 h-14 rounded-full overflow-hidden my-4 ml-3">
        <img src={imageUrl} className="object-cover h-full w-full" />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold mb-1 text-left">{name}</h3>
        <div
          className={classNames(
            "flex font-light",
            "group-hover:text-primary-light",
            isActive ? "text-primary-light" : "text-gray-500"
          )}
        >
          <TimeIcon />
          <p className="ml-1">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}

type IngredientsWrapperProps = {
  children: React.ReactNode;
};
export function IngredientsWrapper({ children }: IngredientsWrapperProps) {
  return (
    <div className="grid grid-cols-[30%_auto_min-content] my-4 gap-2">
      {children}
    </div>
  );
}
