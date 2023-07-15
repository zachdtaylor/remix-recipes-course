import type { LinksFunction } from "@remix-run/node";
import {
  PageDescription,
  links as pageDescriptionLinks,
} from "~/components/page-description";

export const links: LinksFunction = () => {
  return [...pageDescriptionLinks()];
};

export default function Index() {
  return (
    <div>
      <PageDescription header="Home" message="Welcome home!" />
    </div>
  );
}
