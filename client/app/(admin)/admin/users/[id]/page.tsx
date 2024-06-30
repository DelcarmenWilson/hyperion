import React from "react";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";

import { UserClient } from "./components/client";
import { SharedCallsClient } from "./components/shared-calls/client";
import { ReportCallsClient } from "./components/report-calls/client";
import { AboutMe } from "./components/about-me";

import { callsGetAllByAgentIdFiltered } from "@/actions/call";
import { callsGetAllShared } from "@/data/call";
import { teamsGetAllByOrganization } from "@/data/team";
import { userGetByIdReport } from "@/data/user";
import { weekStartEnd } from "@/formulas/dates";
import { Credentials } from "./components/credentials";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Credentials licenses={user.licenses} npn={user.npn as string} />
        <AboutMe
          firstName={user.firstName}
          lastName={user.lastName}
          image={user.image as string}
          aboutMe={user.aboutMe as string}
          title={user.title as string}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SharedCallsClient calls={sharedCalls} />
        <ReportCallsClient
          calls={calls}
          from={from as string}
          to={to as string}
        />
      </div>
      <CallHistoryClient userId={params.id} duration={duration} />
    </>
  );
};

export default UserPage;
