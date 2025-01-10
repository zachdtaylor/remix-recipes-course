import React from "react";
import classNames from "classnames";
import { TimeIcon } from "~/components/icons";
import { useParams } from "react-router";

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
        params.recipeId ? "hidden" : ""
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

function useDelayedBool(value: boolean | undefined, delay: number) {
  const [delayed, setDelayed] = React.useState(false);
  const timeoutId = React.useRef<number>();
  React.useEffect(() => {
    if (value) {
      timeoutId.current = window.setTimeout(() => {
        setDelayed(true);
      }, delay);
    } else {
      window.clearTimeout(timeoutId.current);
      setDelayed(false);
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [value, delay]);

  return delayed;
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
  const delayedLoading = useDelayedBool(isLoading, 500);
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
        <img
          src={imageUrl}
          alt={`recipe named ${name}`}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold mb-1 text-left">
          {name}
          {delayedLoading ? "..." : ""}
        </h3>
        <div
          className={classNames(
            "flex font-light",
            "group-hover:text-primary-light",
            isActive ? "text-primary-light" : "text-gray-500",
            isLoading ? "text-gray-500" : ""
          )}
        >
          <TimeIcon />
          <p className="ml-1">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}
