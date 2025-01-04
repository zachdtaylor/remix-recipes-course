import Cryptr from "cryptr";
import { renderToStaticMarkup } from "react-dom/server";
import { sendEmail } from "./utils/emails.server";
import { data } from "@remix-run/node";

if (typeof process.env.MAGIC_LINK_SECRET !== "string") {
  throw new Error("Missing env: MAGIC_LINK_SECRET");
}

const cryptr = new Cryptr(process.env.MAGIC_LINK_SECRET);

type MagicLinkPayload = {
  email: string;
  nonce: string;
  createdAt: string;
};

export function generateMagicLink(email: string, nonce: string) {
  const payload: MagicLinkPayload = {
    email,
    nonce,
    createdAt: new Date().toISOString(),
  };
  const encryptedPayload = cryptr.encrypt(JSON.stringify(payload));

  if (typeof process.env.ORIGIN !== "string") {
    throw new Error("Missing env: ORIGIN");
  }

  const url = new URL(process.env.ORIGIN);
  url.pathname = "/validate-magic-link";
  url.searchParams.set("magic", encryptedPayload);
  return url.toString();
}

function isMagicLinkPayload(value: any): value is MagicLinkPayload {
  return (
    typeof value === "object" &&
    typeof value.email === "string" &&
    typeof value.nonce === "string" &&
    typeof value.createdAt === "string"
  );
}

export function invalidMagicLink(message: string) {
  return data({ message }, { status: 400 });
}

export function getMagicLinkPayload(request: Request) {
  const url = new URL(request.url);
  const magic = url.searchParams.get("magic");

  if (typeof magic !== "string") {
    throw invalidMagicLink("'magic' search parameter does not exist");
  }

  const magicLinkPayload = JSON.parse(cryptr.decrypt(magic));

  if (!isMagicLinkPayload(magicLinkPayload)) {
    throw invalidMagicLink("invalid magic link payload");
  }

  return magicLinkPayload;
}

export function sendMagicLinkEmail(link: string, email: string) {
  if (process.env.NODE_ENV === "production") {
    const html = renderToStaticMarkup(
      <div>
        <h1>Log in to Remix Recipes</h1>
        <p>
          Hey, there! Click the link below to finish logging in to the Remix
          Recipes app.
        </p>
        <a href={link}>Log In</a>
      </div>
    );
    return sendEmail({
      from: "Remix Recipes <zachdtaylor.b@gmail.com>",
      to: email,
      subject: "Log in to Remix Recipes!",
      html,
    });
  } else {
    console.log(link);
  }
}
