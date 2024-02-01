import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
import { callGetAllByLeadId } from "@/data/call";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);

  const calls = await callGetAllByLeadId(lead?.id!);

  return <LeadClient lead={lead!} nextPrev={prevNext} calls={calls} />;
};

export default LeadsPage;
