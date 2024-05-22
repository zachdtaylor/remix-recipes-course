import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

export function loader() {
  return json({ message: "Hello, there!" });
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page.</p>
      <p>Message from loader: {data.message}</p>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
