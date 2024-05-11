import { Cog } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";
import { SubNavBar } from "@/components/custom/sub-navbar";
import { MeetingsNavbarRoutes } from "@/constants/page-routes";

const MeetingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout
      icon={Cog}
      title="Meetings"
      topMenu={<SubNavBar intialRoutes={MeetingsNavbarRoutes} />}
    >
      {children}
    </PageLayout>
  );
};
export default MeetingsLayout;
