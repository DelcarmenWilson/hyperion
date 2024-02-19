import { userGetByIdReport } from "@/data/user";
import React from "react";
import { UserClient } from "./components/client";
import { teamsGetAllByOrganization } from "@/data/team";

const UserPage = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const user = await userGetByIdReport(params.userId);
  const teams = await teamsGetAllByOrganization(
    user?.team?.organizationId as string
  );

  if (!user) {
    return <p className="text-sm text-muted-foreground">User not found!</p>;
  }

  return <UserClient user={user} teams={teams} />;
};

export default UserPage;
