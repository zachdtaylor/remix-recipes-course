import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server";
import { createUser, getUser } from "~/models/user.server";
import { commitSession, getSession } from "~/sessions";
import { Route } from "./+types/validate-magic-link";
import {
  data,
  isRouteErrorResponse,
  redirect,
  useActionData,
} from "react-router";
import { ErrorMessage, PrimaryButton, PrimaryInput } from "~/components/form";
import classNames from "classnames";
import { validateForm } from "~/utils/validation";
import { z } from "zod";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export async function loader({ request }: Route.LoaderArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);

  // 1. Validate expiration time
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + magicLinkMaxAge;

  if (Date.now() > expiresAt) {
    throw invalidMagicLink("the magic link has expired");
  }

  // 2. Validate nonce
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  if (
    !session.get("authNonceVerified") &&
    session.get("nonce") !== magicLinkPayload.nonce
  ) {
    throw invalidMagicLink("invalid nonce");
  }

  const user = await getUser(magicLinkPayload.email);

  if (user) {
    session.set("userId", user.id);
    return redirect("/app", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("authNonceVerified", true);

  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name cannot be blank"),
  lastName: z.string().min(1, "Last name cannot be blank"),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  return validateForm(
    formData,
    signUpSchema,
    async ({ firstName, lastName }) => {
      const magicLinkPayload = getMagicLinkPayload(request);

      const user = await createUser(
        magicLinkPayload.email,
        firstName,
        lastName
      );

      const cookie = request.headers.get("cookie");
      const session = await getSession(cookie);
      session.set("userId", user.id);
      session.unset("authNonceVerified");

      return redirect("/app", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    },
    (errors) =>
      data(
        {
          errors,
          firstName: String(formData.get("firstName")),
          lastName: String(formData.get("lastName")),
        },
        { status: 400 }
      )
  );
}

export default function ValidateMagicLink() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="text-center">
      <div className="mt-24">
        <h1 className="text-2xl my-8">You're almost done!</h1>
        <h2>Type in your name below to complete the signup process.</h2>
        <form
          method="post"
          className={classNames(
            "flex flex-col px-8 mx-16 md:mx-auto",
            "border-2 border-gray-200 rounded-md p-8 mt-8 md:w-80"
          )}
        >
          <fieldset className="mb-8 flex flex-col">
            <div className="text-left mb-4">
              <label htmlFor="firstName">First Name</label>
              <PrimaryInput
                id="firstName"
                autoComplete="off"
                name="firstName"
                defaultValue={actionData?.firstName}
              />
              <ErrorMessage>{actionData?.errors?.firstName}</ErrorMessage>
            </div>
            <div className="text-left">
              <label htmlFor="lastName">Last Name</label>
              <PrimaryInput
                id="lastName"
                autoComplete="off"
                name="lastName"
                defaultValue={actionData?.lastName}
              />
              <ErrorMessage>{actionData?.errors?.lastName}</ErrorMessage>
            </div>
          </fieldset>
          <PrimaryButton className="w-36 mx-auto">Sign Up</PrimaryButton>
        </form>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return `There was an error validating the magic link: ${error.data.message}`;
  }
  return "An unknown error occurred";
}
