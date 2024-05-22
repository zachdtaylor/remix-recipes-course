import { json } from "@remix-run/node";
import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";
import { loader as childLoader } from "./settings/profile";

export function loader() {
  return json({ message: "Hello, there!" });
}

export default function Settings() {
  const data = useRouteLoaderData<typeof childLoader>(
    "routes/settings/profile"
  );
  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page.</p>
      <p>Message from loader: {data?.message}</p>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
