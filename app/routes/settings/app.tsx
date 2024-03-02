import { z } from "zod";
import { themeCookie } from "~/cookies";
import { validateForm } from "~/utils/validation";
import { Route } from "./+types/app";
import { data, Form } from "react-router";
import { PrimaryButton } from "~/components/form";

const themeSchema = z.object({
  theme: z.string(),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  return validateForm(
    formData,
    themeSchema,
    async ({ theme }) =>
      data("ok", {
        headers: { "Set-Cookie": await themeCookie.serialize(theme) },
      }),
    (errors) => data({ errors }, { status: 400 })
  );
}

export default function App() {
  return (
    <Form reloadDocument method="post">
      <div className="mb-4 flex flex-col">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          name="theme"
          className="p-2 mt-2 border-2 border-gray-200 rounded-md w-full md:w-64"
          defaultValue="green"
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </div>
      <PrimaryButton>Save</PrimaryButton>
    </Form>
  );
}
