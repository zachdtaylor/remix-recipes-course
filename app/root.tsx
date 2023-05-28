import {
  ErrorBoundaryComponent,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { LinksFunction } from "@remix-run/node";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useResolvedPath,
  useTransition,
} from "@remix-run/react";

import styles from "./tailwind.css";
import reachDialogStyles from "@reach/dialog/styles.css";

import {
  DiscoverIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import { classNames } from "./utils/misc";
import React from "react";
import { getCurrentUser } from "./utils/auth.server";

export const meta: MetaFunction = () => {
  return {
    title: "Remix Recipes",
    description: "Welcome to the Remix Recipes app!",
  };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "/theme.css" },
    { rel: "stylesheet", href: reachDialogStyles },
    { rel: "stylesheet", href: styles },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);

  return json({ isLoggedIn: user !== null });
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen bg-background">
        <nav
          className={classNames(
            "bg-primary text-white md:w-16",
            "flex justify-between md:flex-col"
          )}
        >
          <ul className="flex md:flex-col">
            <AppNavLink to="discover">
              <DiscoverIcon />
            </AppNavLink>
            {data.isLoggedIn ? (
              <AppNavLink to="app">
                <RecipeBookIcon />
              </AppNavLink>
            ) : null}
            <AppNavLink to="settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
          <ul>
            {data.isLoggedIn ? (
              <AppNavLink to="/logout">
                <LogoutIcon />
              </AppNavLink>
            ) : (
              <AppNavLink to="/login">
                <LoginIcon />
              </AppNavLink>
            )}
          </ul>
        </nav>
        <div className="p-4 w-full md:w-[calc(100%-4rem)]">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type AppNavLinkProps = {
  children: React.ReactNode;
  to: string;
};
function AppNavLink({ children, to }: AppNavLinkProps) {
  const path = useResolvedPath(to);
  const transition = useTransition();

  const isLoading =
    transition.state === "loading" &&
    transition.location.pathname === path.pathname &&
    transition.type === "normalLoad";

  return (
    <li className="w-16">
      <NavLink to={to}>
        {({ isActive }) => (
          <div
            className={classNames(
              "py-4 text-center hover:bg-primary-light",
              isActive ? "bg-primary-light" : "",
              isLoading ? "bg-primary-light animate-pulse" : ""
            )}
          >
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <html>
      <head>
        <title>Whoops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-4">
          <h1 className="text-2xl pb-3">Whoops!</h1>
          <p>You're seeing this page because an unexpected error occurred.</p>
          <p className="my-4 font-bold">{error.message}</p>
          <Link to="/" className="text-primary">
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Whoops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-4">
          <h1 className="text-2xl pb-3">
            {caught.status} - {caught.statusText}
          </h1>
          <p>You're seeing this page because an error occurred.</p>
          <p className="my-4 font-bold">{caught.data.message}</p>
          <Link to="/" className="text-primary">
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
}
