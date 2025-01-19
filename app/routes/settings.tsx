import { useRouteError } from "react-router";
import { PageLayout } from "~/components/layout";

export default function Settings() {
  return <PageLayout title="Settings" links={[{ to: "app", label: "App" }]} />;
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
