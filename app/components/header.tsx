import { LinksFunction } from "remix";
import headerStyles from "./header.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: headerStyles }];
};

type HeaderProps = {
  children: string;
};
export function Header({ children }: HeaderProps) {
  return <h1 className="header">{children}</h1>;
}
