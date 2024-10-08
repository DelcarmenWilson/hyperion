import { Cog } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page";
import { SubNavBar } from "@/components/custom/sub-navbar";
import { SettingsRoutes } from "@/constants/page-routes";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout
      icon={Cog}
      title="Settings"
      topMenu={<SubNavBar intialRoutes={SettingsRoutes} />}
      justify={false}
      scroll={false}
    >
      {children}
    </PageLayout>
  );
}
