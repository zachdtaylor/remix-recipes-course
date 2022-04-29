import type { MetaFunction } from "@remix-run/node";
import { LinksFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useResolvedPath,
  useTransition,
} from "@remix-run/react";

import styles from "./tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import { classNames } from "./utils/misc";
import React from "react";

export const meta: MetaFunction = () => {
  return {
    title: "Remix Recipes",
    description: "Welcome to the Remix Recipes app!",
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  const matches = useMatches();
  React.useEffect(() => {
    console.log(matches);
  }, [matches]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen">
        <nav className="bg-primary text-white md:w-16">
          <ul className="flex md:flex-col">
            <AppNavLink to="/">
              <HomeIcon />
            </AppNavLink>
            <AppNavLink to="discover">
              <DiscoverIcon />
            </AppNavLink>
            <AppNavLink to="app">
              <RecipeBookIcon />
            </AppNavLink>
            <AppNavLink to="settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
        </nav>
        <div className="p-4 w-full">
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
    transition.location.pathname === path.pathname;

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
