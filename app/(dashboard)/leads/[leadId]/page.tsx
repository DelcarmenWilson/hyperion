import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
// import { conversationGetByLeadId } from "@/data/conversation";
import { PageLayout } from "@/components/custom/page-layout";
import { User } from "lucide-react";
import { TopMenu } from "./components/top-menu";
import { LeadTabsClient } from "./components/tabs-client";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);
  // const conversation = await conversationGetByLeadId(params.leadId);
  if (!lead) return null;
  return (
    <PageLayout
      icon={User}
      title={`View Lead - ${lead.firstName}`}
      topMenu={<TopMenu nextPrev={prevNext} />}
    >
      <LeadClient lead={lead} />
      <LeadTabsClient lead={lead} />
    </PageLayout>
  );
};

export default LeadsPage;
