import { Route } from "./+types/discover";
import styles from "~/styles/index.css?url";

export const links: Route.LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Discover() {
  return (
    <div>
      <h1>Discover</h1>
      <p>This is the discover page</p>
    </div>
  );
}
