import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server";
import { commitSession, getSession } from "~/sessions";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export async function loader({ request }: LoaderFunctionArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);

  // 1. Validate expiration time
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + magicLinkMaxAge;

  if (Date.now() > expiresAt) {
    throw invalidMagicLink("the magic link has expired");
  }

  // 2. Validate nonce
  const cookieHeader = request.headers.get("cookie");
  const session = await getSession(cookieHeader);

  if (session.get("nonce") !== magicLinkPayload.nonce) {
    throw invalidMagicLink("invalid nonce");
  }

  return json("ok", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
