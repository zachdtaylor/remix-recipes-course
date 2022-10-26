import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { z } from "zod";
import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/forms";
import { generateMagicLink, sendMagicLinkEmail } from "~/magic-links.server";
import { getUser } from "~/models/user.server";
import { commitSession, getSession } from "~/sessions";
import { classNames } from "~/utils/misc";
import { validateForm } from "~/utils/validation";
import { v4 as uuid } from "uuid";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  console.log("Session data: ", session.data);
  return null;
};

const loginSchema = z.object({
  email: z.string().email(),
});

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);
  const formData = await request.formData();

  return validateForm(
    formData,
    loginSchema,
    async ({ email }) => {
      const nonce = uuid();
      session.set("nonce", nonce);

      const link = generateMagicLink(email, nonce);
      await sendMagicLinkEmail(link, email);

      return json("ok", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    },
    (errors) => json({ errors, email: formData.get("email") }, { status: 400 })
  );
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="text-center mt-36">
      {actionData === "ok" ? (
        <div>
          <h1 className="text-2xl py-8">Yum!</h1>
          <p>
            Check your email and follow the instructions to finish logging in.
          </p>
        </div>
      ) : (
        <div>
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
      )}
    </div>
  );
}
