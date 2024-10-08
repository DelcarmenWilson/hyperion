"use client";
import { useState } from "react";
import { useTeamData } from "./hooks/use-team";
import { useCurrentUser } from "@/hooks/use-current-user";

import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { TeamForm } from "./components/form";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./components/columns";
import { TeamList } from "./components/list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const TeamsPage = () => {
  const { teams, isFetchingTeams } = useTeamData();
  const user = useCurrentUser();

  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="Add Team"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => {}}
      showButton={false}
    />
  );

  return (
    <PageLayoutAdmin
      title={`Teams (${teams ? teams.length : 0})`}
      description="Manage teams for your organization."
      topMenu={<TeamForm enabled={user?.role == "SUPER_ADMIN"} />}
    >
      <SkeletonWrapper isLoading={isFetchingTeams}>
        {isList ? (
          <DataTable
            columns={columns}
            data={teams || []}
            headers
            title="Teams"
            topMenu={topMenu}
          />
        ) : (
          <>
            <div className="flex justify-between items-center p-1">
              <h4 className="text-2xl font-semibold">Teams</h4>
              {topMenu}
            </div>
            <TeamList teams={teams || []} />
          </>
        )}
      </SkeletonWrapper>
    </PageLayoutAdmin>
  );
};

export default TeamsPage;
