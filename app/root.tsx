import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useResolvedPath,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  LoginIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import classNames from "classnames";
import React from "react";
import { getCurrentUser } from "./utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Recipes" },
    { name: "description", content: "Welcome to the Remix Recipes app!" },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getCurrentUser(request);

  return json({ isLoggedIn: user !== null });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            <AppNavLink to="/">
              <HomeIcon />
            </AppNavLink>
            <AppNavLink to="discover">
              <DiscoverIcon />
            </AppNavLink>
            {data.isLoggedIn ? (
              <AppNavLink to="app/pantry">
                <RecipeBookIcon />
              </AppNavLink>
            ) : null}
            <AppNavLink to="settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
          <ul>
            <AppNavLink to="/login">
              <LoginIcon />
            </AppNavLink>
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
  to: string;
  children: React.ReactNode;
};
function AppNavLink({ children, to }: AppNavLinkProps) {
  const path = useResolvedPath(to);
  const navigation = useNavigation();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === path.pathname &&
    navigation.formData === null;

  return (
    <li className="w-16">
      <NavLink to={to}>
        {({ isActive }) => (
          <div
            className={classNames(
              "py-4 flex justify-center hover:bg-primary-light",
              isActive ? "bg-primary-light" : "",
              isLoading ? "animate-pulse bg-primary-light" : ""
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

  return (
    <html lang="en">
      <head>
        <title>Whoops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-4">
          {isRouteErrorResponse(error) ? (
            <>
              <h1 className="text-2xl pb-3">
                {error.status} - {error.statusText}
              </h1>
              <p>You're seeing this page because an error occurred.</p>
              <p className="my-4 font-bold">{error.data.message}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl pb-3">Whoops!</h1>
              <p>
                You're seeing this page because an unexpected error occurred.
              </p>
              {error instanceof Error ? (
                <p className="my-4 font-bold">{error.message}</p>
              ) : null}
            </>
          )}
          <Link to="/" className="text-primary">
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
}
