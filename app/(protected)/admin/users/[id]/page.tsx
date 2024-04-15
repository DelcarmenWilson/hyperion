import React from "react";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";

import { UserClient } from "./components/client";
import { SharedCallsClient } from "./components/shared-calls/client";
import { ReportCallsClient } from "./components/report-calls/client";

import {
  callsGetAllByAgentIdFiltered,
  callsGetAllShared,
} from "@/actions/call";
import { teamsGetAllByOrganization } from "@/actions/team";
import { userGetByIdReport } from "@/actions/user";
import { weekStartEnd } from "@/formulas/dates";

const UserPage = async ({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const week = weekStartEnd();
  const from = searchParams.from || week.from.toString();
  const to = searchParams.to || week.to.toString();

  const calls = await callsGetAllByAgentIdFiltered(
    params.id,
    from as string,
    to as string
  );
  const duration = calls.reduce((sum, call) => sum + call.duration!, 0);

  const sharedCalls = await callsGetAllShared();

  const user = await userGetByIdReport(params.id);
  const teams = await teamsGetAllByOrganization(
    user?.team?.organizationId as string
  );

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found!</p>;
  }

  return (
    <>
      <UserClient user={user} callsLength={calls.length} teams={teams} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className=" col-span-2">
          <SharedCallsClient calls={sharedCalls} />
        </div>
        <ReportCallsClient
          calls={calls}
          from={from as string}
          to={to as string}
        />
      </div>
      <CallHistoryClient initialCalls={calls} duration={duration} />
    </>
  );
};

export default UserPage;
