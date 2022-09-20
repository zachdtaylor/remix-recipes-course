import { createCookie } from "react-router";

export const userIdCookie = createCookie("remix-recipes__userId", {
  httpOnly: true,
  secure: true,
});
