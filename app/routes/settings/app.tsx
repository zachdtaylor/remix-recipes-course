import { Form } from "@remix-run/react";
import { PrimaryButton } from "~/components/forms";

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
