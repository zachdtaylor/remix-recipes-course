import { json } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { loader as parentLoader } from "../settings";

export function loader() {
  return json({ message: "Yo" });
}

export default function Profile() {
  const data = useRouteLoaderData<typeof parentLoader>("routes/settings");
  return (
    <div>
      <h1>Profile Settings</h1>
      <p>These are the profile settings</p>
      <p>Message: {data?.message}</p>
    </div>
  );
}
