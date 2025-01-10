import {
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useResolvedPath,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import {
  DiscoverIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import classNames from "classnames";
import { getCurrentUser } from "./utils/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Remix Recipes" },
    { name: "description", content: "Welcome to the Remix Recipes app!" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

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
      <body className="md:flex md:h-screen">
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
      <nav className="bg-primary text-white md:w-16 flex justify-between md:flex-col">
        <ul className="flex md:flex-col">
          <AppNavLink to="/">
            <HomeIcon />
          </AppNavLink>
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
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
    navigation.formData === null;

  return (
    <li className="w-16">
      <NavLink to={to}>
        {({ isActive }) => (
          <div
            className={classNames(
              "py-4 flex justify-center hover:bg-primary-light",
              {
                "bg-primary-light": isActive || isLoading,
                "animate-pulse": isLoading,
              }
            )}
          >
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}
