import { destroySession, getSession } from "~/sessions";
import { data } from "react-router";
import { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  return data("ok", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Logout() {
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl">You're good to go!</h1>
        <p className="py-8">Logout successful</p>
        <a href="/" className="text-primary">
          Take me home
        </a>
      </div>
    </div>
  );
}
