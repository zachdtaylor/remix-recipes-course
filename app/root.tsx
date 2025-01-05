import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useResolvedPath,
  useRouteError,
  useNavigation,
} from "react-router";
import {
  DiscoverIcon,
  LoginIcon,
  LogoutIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import { classNames } from "./utils/misc";
import React from "react";
import { getCurrentUser } from "./utils/auth.server";
import { Route } from "./+types/root";

import styles from "./tailwind.css?url";

export function meta() {
  return [
    { title: "Remix Recipes" },
    { description: "Welcome to the Remix Recipes app!" },
  ];
}

export const links: Route.LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "/theme.css" },
    { rel: "stylesheet", href: styles },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);

  return { isLoggedIn: user !== null };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen bg-background">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
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
    </>
  );
}

type AppNavLinkProps = {
  children: React.ReactNode;
  to: string;
};
function AppNavLink({ children, to }: AppNavLinkProps) {
  const path = useResolvedPath(to);
  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === path.pathname &&
    !navigation.formData;

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="p-4">
        <h1 className="text-2xl pb-3">
          {error.status} - {error.statusText}
        </h1>
        <p>You're seeing this page because an error occurred.</p>
        <p className="my-4 font-bold">{error.data.message}</p>
        <Link to="/" className="text-primary">
          Take me home
        </Link>
      </div>
    );
  }

  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl pb-3">Whoops!</h1>
      <p>You're seeing this page because an unexpected error occurred.</p>
      <p className="my-4 font-bold">{errorMessage}</p>
      <Link to="/" className="text-primary">
        Take me home
      </Link>
    </div>
  );
}
