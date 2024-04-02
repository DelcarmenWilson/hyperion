import { userGetByIdReport } from "@/data/user";
import React from "react";
import { UserClient } from "./components/client";
import { teamsGetAllByOrganization } from "@/data/team";
import { weekStartEnd } from "@/formulas/dates";
import { callsGetAllByAgentIdFiltered, callsGetAllShared } from "@/data/call";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";
import { SharedCallsClient } from "./components/shared-calls/client";

const UserPage = async ({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const week = weekStartEnd();
  const from = searchParams.from || week.from.toString();
  const to = searchParams.to || week.to.toString();

  const calls = await callsGetAllByAgentIdFiltered(
    params.userId,
    from as string,
    to as string
  );
  const duration = calls.reduce((sum, call) => sum + call.duration!, 0);

  const sharedCalls = await callsGetAllShared();

  const user = await userGetByIdReport(params.userId);
  const teams = await teamsGetAllByOrganization(
    user?.team?.organizationId as string
  );

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found!</p>;
  }

  return (
    <>
      <UserClient user={user} callsLength={calls.length} teams={teams} />
      <SharedCallsClient calls={sharedCalls} />
      <CallHistoryClient initialCalls={calls} duration={duration} />
    </>
  );
};

export default UserPage;
