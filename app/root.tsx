import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css";
import {
  DiscoverIcon,
  HomeIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Recipes" },
    { name: "description", content: "Welcome to the Remix Recipes app!" },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen">
        <nav className="bg-primary text-white">
          <ul className="flex flex-col">
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
        <div className="p-4">
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
function AppNavLink({ to, children }: AppNavLinkProps) {
  return (
    <li className="w-16">
      <Link to={to}>
        <div className="py-4 flex justify-center hover:bg-primary-light">
          {children}
        </div>
      </Link>
    </li>
  );
}
