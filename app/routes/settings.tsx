import React from "react";
import { Await, Link, Outlet, useLoaderData, useLocation } from "react-router";

export async function loader() {
  const slowMessage = new Promise<string>((resolve) => {
    setTimeout(() => resolve("This message is slow!"), 700);
  });
  return { message: "Hello, there!", slowMessage };
}

export default function Settings() {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page</p>
      <p>Message from the loader: {data.message}</p>
      <React.Suspense fallback={<div>Loading...</div>} key={location.pathname}>
        <Await resolve={data.slowMessage}>
          {(value) => <p>Another message: {value}</p>}
        </Await>
      </React.Suspense>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
