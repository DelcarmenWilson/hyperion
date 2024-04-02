import {
  callsGetAllByAgentId,
  callsGetAllByAgentIdFiltered,
} from "@/data/call";
import { currentUser } from "@/lib/auth";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";
import { weekStartEnd } from "@/formulas/dates";

const CallPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const week = weekStartEnd();
  const from = (searchParams.from || week.from.toString()) as string;
  const to = (searchParams.to || week.to.toString()) as string;

  const calls = await callsGetAllByAgentIdFiltered(user.id, from, to);

  return <CallHistoryClient initialCalls={calls} showDate />;
};

export default CallPage;
