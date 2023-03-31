import { json } from "@remix-run/node";

export function loader() {
  const data = { message: "Hello from the resource route!" };

  return json(data);
}
