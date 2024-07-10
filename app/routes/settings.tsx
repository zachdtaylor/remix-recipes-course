import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div className="bg-red-300 border-2 border-red-600 rounded-md p-4">
        <h1>Whoops, something went wrong.</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return <div>An unexpected error occurred.</div>;
}
