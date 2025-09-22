import { LoaderFunctionArgs, redirect } from "react-router";
import { deleteUser } from "~/models/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    throw new Error("email is required to delete user");
  }

  await deleteUser(email);
  return redirect("/");
}
