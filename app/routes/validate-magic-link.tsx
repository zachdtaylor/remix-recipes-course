import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getMagicLinkPayload } from "~/magic-links.server";

export function loader({ request }: LoaderFunctionArgs) {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);
  return json("ok");
}

