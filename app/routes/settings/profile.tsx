import { json, LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = () => {
  return json({ message: "Yo" });
};

export default function Profile() {
  const data = useLoaderData();
  return (
    <div>
      <h2>Profile Settings</h2>
      <p>These are the profile settings</p>
      <p>Message: {data.message}</p>
    </div>
  );
}
