import {
  ErrorBoundaryComponent,
  json,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";

export const loader: LoaderFunction = () => {
  // const user = db.user.get(id)
  // if (!user) {
  // throw json({ message: "You can't access this page" }, { status: 401 });
  return json({ message: "Yo" });
};

export default function Profile() {
  const data = useLoaderData();
  return (
    <div>
      <h2>Profile Settings</h2>
      <p>These are the profile settings</p>
      <p>Message: {data.values.message}</p>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div className="bg-red-500 text-white rounded-md p-4">
      <h1>An unexpected error occurred.</h1>
      <p>{error.message}</p>
    </div>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  return (
    <div className="bg-red-500 text-white rounded-md p-4">
      <h1>{caught.data.message}</h1>
    </div>
  );
};
