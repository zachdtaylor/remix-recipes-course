import { LoaderFunctionArgs, redirect } from "react-router";
import { createUser, getUser } from "~/models/user.server";
import { commitSession, getSession } from "~/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const firstName = url.searchParams.get("firstName");
  const lastName = url.searchParams.get("lastName");
  const email = url.searchParams.get("email");

  if (!email) {
    throw new Error("email is required to log in");
  }

  let user = await getUser(email);

  if (!user) {
    if (!firstName || !lastName) {
      throw new Error("first and last name are required to log in");
    }
    user = await createUser(email, firstName, lastName);
  }

  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);
  session.set("userId", user.id);

  return redirect("/app", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
