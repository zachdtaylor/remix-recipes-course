import { PageLayout } from "~/components/layout";

export default function Settings() {
  return <PageLayout title="Settings" links={[{ to: "app", label: "App" }]} />;
}
