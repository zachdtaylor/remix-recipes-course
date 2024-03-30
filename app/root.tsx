import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import styles from "~/tailwind.css?url";
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

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
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
    </>
  );
}

type AppNavLinkProps = {
  children: React.ReactNode;
  to: string;
};
function AppNavLink({ children, to }: AppNavLinkProps) {
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
