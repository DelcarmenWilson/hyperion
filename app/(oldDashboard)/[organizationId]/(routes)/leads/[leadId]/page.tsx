import { leadGetById } from "@/data/lead";
import { LeadClient } from "./components/lead-client";
import { conversationGetByLeadId } from "@/data/conversation";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const conversation = await conversationGetByLeadId(lead?.id!);

  return (
    <div className="py-4">
      <LeadClient conversation={conversation} lead={lead!} />
    </div>
  );
};

export default LeadsPage;
