import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/forms";
import { commitSession, getSession } from "~/sessions";
import { validateForm } from "~/utils/validation";
import { v4 as uuid } from "uuid";
import { generateMagicLink } from "~/magic-links.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  console.log("Session data: ", session.data);
  return null;
}

const loginSchema = z.object({
  email: z.string().email(),
});

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();

  return validateForm(
    formData,
    loginSchema,
    async ({ email }) => {
      const nonce = uuid();
      session.flash("nonce", nonce);

      const link = generateMagicLink(email, nonce);
      console.log(link);

      return json("ok", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    },
    (errors) => json({ errors, email: formData.get("email") }, { status: 400 })
  );
}

export default function Login() {
  const actionData = useActionData<any>();
  return (
    <div className="text-center mt-36">
      <h1 className="text-3xl mb-8">Remix Recipes</h1>
      <form method="post" className="mx-auto md:w-1/3">
        <div className="text-left pb-4">
          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            defaultValue={actionData?.email}
          />
          <ErrorMessage>{actionData?.errors?.email}</ErrorMessage>
        </div>
        <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
      </form>
    </div>
  );
}
