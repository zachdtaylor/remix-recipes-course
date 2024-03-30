import "./header.css";

export function Header({ children }: { children: string }) {
  return <h1 className="header">{children}</h1>;
}
