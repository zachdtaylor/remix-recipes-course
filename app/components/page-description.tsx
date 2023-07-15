import type { LinksFunction } from "@remix-run/node";
import { Header, links as headerLinks } from "./header";
import pageDescriptionStyles from "./page-description.css";

export const links: LinksFunction = () => {
  return [...headerLinks(), { rel: "stylesheet", href: pageDescriptionStyles }];
};

type PageDescriptionProps = {
  header: string;
  message: string;
};
export function PageDescription({ header, message }: PageDescriptionProps) {
  return (
    <div>
      <Header>{header}</Header>
      <p className="page-description-message">{message}</p>
    </div>
  );
}
