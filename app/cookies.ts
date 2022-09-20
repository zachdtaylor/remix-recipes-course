import { createCookie } from "@remix-run/node";

export const userIdCookie = createCookie("remix-recipes__userId", {
  httpOnly: true,
  secure: true,
});
