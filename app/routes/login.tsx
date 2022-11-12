import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/form";
import { Route } from "./+types/login";
import { validateForm } from "~/utils/validation";
import { z } from "zod";
import { data, useActionData } from "react-router";
import { commitSession, getSession } from "~/sessions";
import { v4 as uuid } from "uuid";
import { generateMagicLink, sendMagicLinkEmail } from "~/magic-links.server";
import { requireLoggedOutUser } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireLoggedOutUser(request);
  return null;
}

const loginSchema = z.object({
  email: z.string().email(),
});

export async function action({ request }: Route.ActionArgs) {
  await requireLoggedOutUser(request);

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
      await sendMagicLinkEmail(link, email);

      return data(
        { ok: true },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    },
    (errors) =>
      data(
        { errors, email: formData.get("email")?.toString() },
        { status: 400 }
      )
  );
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  const defaultValue =
    actionData !== undefined && "email" in actionData ? actionData?.email : "";
  const emailError =
    actionData !== undefined && "errors" in actionData
      ? actionData?.errors.email
      : "";

  return actionData !== undefined && "ok" in actionData && actionData.ok ? (
    <div className="text-center pt-20">
      <h1 className="text-2xl py-8">Yum!</h1>
      <p>Check your email and follow the instructions to finish logging in.</p>
    </div>
  ) : (
    <div className="text-center mt-36">
      <h1 className="text-3xl mb-8">Remix Recipes</h1>
      <form method="post" className="mx-auto md:w-1/3">
        <div className="text-left pb-4">
          <PrimaryInput
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            defaultValue={defaultValue}
          />
          <ErrorMessage>{emailError}</ErrorMessage>
        </div>
        <PrimaryButton className="w-1/3 mx-auto">Log In</PrimaryButton>
      </form>
    </div>
  );
}
