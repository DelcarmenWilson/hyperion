import React from "react";
import { CallHistoryClient } from "@/components/callhistory/client";

import { UserClient } from "./components/client";
import { SharedCallsClient } from "@/components/global/shared-calls";
import { ReportCallsClient } from "./components/report-calls/client";
import { AboutMe } from "./components/about-me";
import { Credentials } from "./components/credentials";

import { callsGetAllByAgentIdFiltered } from "@/actions/call";
import { teamsGetAllByOrganization } from "@/actions/team";
import { userGetByIdReport } from "@/data/user";

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

  const user = await userGetByIdReport(params.id);
  const teams = await teamsGetAllByOrganization(
    user?.team?.organizationId as string
  );

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found!</p>;
  }
  //TODO - need to make the second div scrollable
  return (
    <div className="flex flex-col h-full overflow-y-auto gap-4">
      <UserClient user={user} callsLength={calls.length} teams={teams} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
        <SharedCallsClient />
        <ReportCallsClient
          calls={calls}
          from={from as string}
          to={to as string}
        />
      </div>
      <CallHistoryClient userId={params.id} duration={duration} />
    </div>
  );
};

export default UserPage;
