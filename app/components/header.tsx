type HeaderProps = {
  children: string;
};
export function Header({ children }: HeaderProps) {
  return <h1 className="text-lg text-gray-800">{children}</h1>;
}
