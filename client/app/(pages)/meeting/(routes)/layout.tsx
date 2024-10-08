import { Cog } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page";
import { SubNavBar } from "@/components/custom/sub-navbar";
import { MeetingRoutes } from "@/constants/page-routes";

const MeetingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout
      icon={Cog}
      title="Meetings"
      topMenu={<SubNavBar intialRoutes={MeetingRoutes} />}
    >
      {children}
    </PageLayout>
  );
};
export default MeetingsLayout;
