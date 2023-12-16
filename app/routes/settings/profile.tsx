import { json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";

export function loader() {
  return json({ message: "Yo" });
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>Profile Settings</h2>
      <p>These are the profile settings</p>
      <p>Message: {data.message}</p>
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
