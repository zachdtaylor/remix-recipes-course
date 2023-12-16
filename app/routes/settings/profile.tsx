import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return json({ message: "Yo" });
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Profile Settings</h1>
      <p>These are the profile settings</p>
      <p>Message: {data.message}</p>
    </div>
  );
}
