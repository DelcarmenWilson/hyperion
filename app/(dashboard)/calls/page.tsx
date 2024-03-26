import { callGetAllByAgentId } from "@/data/call";
import { currentUser } from "@/lib/auth";
import { CallHistoryClient } from "../../../components/reusable/callhistory/client";

const CallPage = async () => {
  const user = await currentUser();
  const calls = await callGetAllByAgentId(user?.id!);

  return <CallHistoryClient initialCalls={calls} />;
};

export default CallPage;
