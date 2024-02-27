import { callGetAllByAgentId } from "@/data/call";
import { currentUser } from "@/lib/auth";
import { CallHistoryClient } from "../dashboard/components/callhistory/call-history";

const CallPage = async () => {
  const user = await currentUser();
  const calls = await callGetAllByAgentId(user?.id!);

  return <CallHistoryClient initialCalls={calls} />;
};

export default CallPage;
