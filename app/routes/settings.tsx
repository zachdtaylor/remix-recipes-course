import { Link, Outlet } from "@remix-run/react";

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page.</p>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
}
