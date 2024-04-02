import { Cog } from "lucide-react";
import { NavBar } from "./components/navbar";
import { PageLayout } from "@/components/custom/layout/page-layout";

const MeetingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout icon={Cog} title="Meetings" topMenu={<NavBar />}>
      {children}
    </PageLayout>
  );
};
export default MeetingsLayout;
