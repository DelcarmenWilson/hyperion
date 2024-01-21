import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);

  return <LeadClient lead={lead!} nextPrev={prevNext} />;
};

export default LeadsPage;
