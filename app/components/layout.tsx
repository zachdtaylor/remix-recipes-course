import classNames from "classnames";
import { Outlet, NavLink as RemixNavLink } from "react-router";

type PageLayoutProps = {
  title: string;
  links: Array<{ to: string; label: string }>;
};
export function PageLayout({ title, links }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">{title}</h1>
      <nav className="border-b-2 pb-2 mt-2">
        {links.map(({ to, label }) => (
          <NavLink key={label} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="py-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
};
function NavLink({ to, children }: NavLinkProps) {
  return (
    <RemixNavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          "hover:text-gray-500 pb-2.5 px-2 md:px-4",
          isActive ? "border-b-2 border-b-primary" : ""
        )
      }
    >
      {children}
    </RemixNavLink>
  );
}
