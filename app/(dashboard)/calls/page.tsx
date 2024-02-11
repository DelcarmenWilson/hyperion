import { callGetAllByAgentId } from "@/data/call";
import { CallHistoryColumn } from "../dashboard/components/callhistory/columns";
import { currentUser } from "@/lib/auth";
import { CallHistory } from "../dashboard/components/callhistory/call-history";

const CallPage = async () => {
  const user = await currentUser();
  const calls = await callGetAllByAgentId(user?.id!);

  const formatedCallHistory: CallHistoryColumn[] = calls.map((call) => ({
    id: call.id,
    agentName: user?.name!,
    phone: call.lead?.cellPhone!,
    from: call.from,
    direction: call.direction,
    fullName: `${call.lead?.firstName} ${call.lead?.lastName}`,
    email: call.lead?.email!,
    duration: call.duration!,
    date: call.createdAt,
    recordUrl: call.recordUrl as string,
    lead: call.lead || undefined,
  }));
  return <CallHistory initialCalls={formatedCallHistory} />;
};

export default CallPage;
