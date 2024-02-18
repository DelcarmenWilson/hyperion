import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
import { conversationGetByLeadId } from "@/data/conversation";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);
  const conversation = await conversationGetByLeadId(params.leadId);

  return (
    <LeadClient lead={lead!} conversation={conversation!} nextPrev={prevNext} />
  );
};

export default LeadsPage;
