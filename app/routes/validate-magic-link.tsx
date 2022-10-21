import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json("ok");
};
