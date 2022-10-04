import { createCookieSessionStorage } from "@remix-run/node";
import { sessionCookie } from "./cookies";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };
