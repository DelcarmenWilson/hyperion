import { Cog } from "lucide-react";
import { NavBar } from "./components/navbar";
import { PageLayout } from "@/components/custom/layout/page-layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout
      icon={Cog}
      title="Settings"
      topMenu={<NavBar />}
      justify={false}
    >
      {children}
    </PageLayout>
  );
}
