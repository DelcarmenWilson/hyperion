import { leadGetById, leadGetPrevNextById } from "@/data/lead";
import { LeadClient } from "./components/client";
import { callGetAllByLeadId } from "@/data/call";
import { CallHistoryColumn } from "./components/callhistory/columns";

const LeadsPage = async ({ params }: { params: { leadId: string } }) => {
  const lead = await leadGetById(params.leadId);
  const prevNext = await leadGetPrevNextById(params.leadId);

  const calls = await callGetAllByLeadId(lead?.id!);

  const formatedCallHistory: CallHistoryColumn[] = calls.map((call) => ({
    id: call.id,
    direction: call.direction,
    duration: call.duration!,
    date: call.createdAt,
    recordUrl: call.recordUrl as string,
  }));

  return (
    <LeadClient lead={lead!} nextPrev={prevNext} calls={formatedCallHistory} />
  );
};

export default LeadsPage;
