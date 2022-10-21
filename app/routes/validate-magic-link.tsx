import { getMagicLinkPayload } from "~/magic-links.server";
import { Route } from "./+types/validate-magic-link";
import { data } from "react-router";

export function loader({ request }: Route.LoaderArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);
  return new Response("ok");
}
