import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return redirect("/app/recipes");
};
