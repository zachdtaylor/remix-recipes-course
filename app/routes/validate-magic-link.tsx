import { getMagicLinkPayload, invalidMagicLink } from "~/magic-links.server";
import { Route } from "./+types/validate-magic-link";

const magicLinkMaxAge = 1000 * 60 * 10; // 10 minutes

export function loader({ request }: Route.LoaderArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);

  // 1. Validate expiration time
  const createdAt = new Date(magicLinkPayload.createdAt);
  const expiresAt = createdAt.getTime() + magicLinkMaxAge;

  if (Date.now() > expiresAt) {
    throw invalidMagicLink("the magic link has expired");
  }

  // 2. Validate nonce

  return new Response("ok");
}
