import { currentUser } from "@/lib/auth";
import { Users } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";

import { TopMenu } from "./components/top-menu";

import { LeadsClient } from "./components/client";

const LeadsPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  return (
    <PageLayout
      title="View Leads"
      icon={Users}
      topMenu={user.role != "ASSISTANT" && <TopMenu />}
    >
      <LeadsClient />
    </PageLayout>
  );
};

export default LeadsPage;
