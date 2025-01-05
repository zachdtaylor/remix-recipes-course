import { Link, Outlet, useLoaderData } from "react-router";

export async function loader() {
  return { message: "Hello, there!" };
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page</p>
      <p>Message from the loader: {data.message}</p>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
