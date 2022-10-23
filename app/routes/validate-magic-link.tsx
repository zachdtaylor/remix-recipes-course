import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export function loader({ request }: LoaderFunctionArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);

  // 1. Validate expiration time
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + magicLinkMaxAge;

  if (Date.now() > expiresAt) {
    throw invalidMagicLink("the magic link has expired");
  }

  // 2. Validate nonce

  return json("ok");
}

