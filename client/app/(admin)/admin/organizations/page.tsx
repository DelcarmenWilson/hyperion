"use client";

import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useOrganizationData } from "./hooks/use-organization";

import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";

import { columns } from "./components/columns";
import { OrganizationList } from "./components/list";
import { OrganizationForm } from "./components/form";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const OrganizationsPage = () => {
  const { organizations, isFetchingOrganizations } = useOrganizationData();
  const user = useCurrentUser();

  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="Add Organization"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => {}}
      showButton={false}
    />
  );

  // useEffect(() => {
  //   const onTeamDeleted = (id: string) => {
  //     setTeams((teams) => {
  //       if (!teams) return teams;
  //       return teams.filter((e) => e.id !== id);
  //     });
  //   };
  //   const onTeamInserted = (newTeam: FullTeam) => {
  //     const existing = teams?.find((e) => e.id == newTeam.id);
  //     if (existing == undefined) setTeams((teams) => [...teams!, newTeam]);
  //   };

  //   const onTeamUpdated = (updatedTeam: FullTeam) => {
  //     setTeams((teams) => {
  //       if (!teams) return teams;
  //       return teams.filter((e) => e.id != updatedTeam.id).concat(updatedTeam);
  //     });
  //   };
  //   adminEmitter.on("teamDeleted", (id) => onTeamDeleted(id));
  //   adminEmitter.on("teamInserted", (info) => onTeamInserted(info));
  //   adminEmitter.on("teamUpdated", (info) => onTeamUpdated(info));
  //   return () => {
  //     adminEmitter.off("teamDeleted", (id) => onTeamDeleted(id));
  //     adminEmitter.off("teamInserted", (info) => onTeamInserted(info));
  //     adminEmitter.off("teamUpdated", (info) => onTeamUpdated(info));
  //   };
  // }, []);

  return (
    <PageLayoutAdmin
      title={`Organizations (${organizations ? organizations.length : 0})`}
      description="Manage all organizations."
      topMenu={<OrganizationForm enabled={user?.role == "MASTER"} />}
    >
      <SkeletonWrapper isLoading={isFetchingOrganizations}>
        {isList ? (
          <DataTable
            columns={columns}
            data={organizations || []}
            headers
            title="Organizations"
            topMenu={topMenu}
          />
        ) : (
          <>
            <div className="flex justify-between items-center p-1">
              <h4 className="text-2xl font-semibold">Organizations</h4>
              {topMenu}
            </div>
            <OrganizationList organizations={organizations || []} />
          </>
        )}
      </SkeletonWrapper>
    </PageLayoutAdmin>
  );
};

export default OrganizationsPage;
