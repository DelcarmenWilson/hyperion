import { currentUser } from "@/lib/auth";
import { Users } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page-layout";

import { TopMenu } from "./components/top-menu";

import { leadsGetAllByAgentId } from "@/actions/lead";
import { LeadClient } from "./components/client";
const LeadsPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const leads = await leadsGetAllByAgentId(user.id);

  return (
    <PageLayout
      title="View Leads"
      icon={Users}
      topMenu={user.role != "ASSISTANT" && <TopMenu />}
    >
      <LeadClient initLeads={leads} />
    </PageLayout>
  );
};

export default LeadsPage;
