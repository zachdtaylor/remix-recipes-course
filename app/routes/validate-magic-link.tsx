import { json, LoaderFunction } from "@remix-run/node";
import { getMagicLinkPayload } from "~/magic-links.server";

export const loader: LoaderFunction = ({ request }) => {
  const magicLinkPayload = getMagicLinkPayload(request);
  console.log(magicLinkPayload);
  return json("ok");
};
