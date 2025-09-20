import { type User } from "@prisma/client";
import { createContext, MiddlewareFunction, redirect } from "react-router";
import { getCurrentUser } from "~/utils/auth.server";

export const userContext = createContext<User>();

export const requireLoggedOutUserMiddleware: MiddlewareFunction = async ({
  request,
}) => {
  const user = await getCurrentUser(request);

  if (user !== null) {
    throw redirect("/app");
  }
};

export const requireLoggedInUserMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  const user = await getCurrentUser(request);

  if (user === null) {
    throw redirect("/login");
  }

  context.set(userContext, user);
};
