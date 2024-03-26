import { userGetByIdReport } from "@/data/user";
import React from "react";
import { UserClient } from "./components/client";
import { teamsGetAllByOrganization } from "@/data/team";
import { weekStartEnd } from "@/formulas/dates";
import { callGetAllByAgentIdFiltered } from "@/data/call";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";

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

  const calls = await callGetAllByAgentIdFiltered(
    params.userId,
    from as string,
    to as string
  );

  const user = await userGetByIdReport(params.userId);
  const teams = await teamsGetAllByOrganization(
    user?.team?.organizationId as string
  );

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found!</p>;
  }

  return (
    <>
      <UserClient user={user} calls={calls} teams={teams} />
      {/* <CallHistoryClient initialCalls={calls} /> */}
    </>
  );
};

export default UserPage;
