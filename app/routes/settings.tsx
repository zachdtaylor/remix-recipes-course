import { Link, LoaderFunction, Outlet, useLoaderData, json } from "remix";

export const loader: LoaderFunction = () => {
  return json({ message: "Hello, there!" });
};

export default function Settings() {
  const data = useLoaderData();
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
