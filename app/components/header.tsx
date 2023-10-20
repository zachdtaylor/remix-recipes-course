type HeaderProps = {
  children: string;
};
export function Header({ children }: HeaderProps) {
  return <h1 className="header">{children}</h1>;
}
