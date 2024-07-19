"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FullTeam } from "@/types";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { TeamList } from "./list";

type TeamClientProps = {
  intitTeams: FullTeam[];
};
export const TeamClient = ({ intitTeams }: TeamClientProps) => {
  const user = useCurrentUser();
  const [teams, setTeams] = useState(intitTeams);
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

  useEffect(() => {
    const onTeamDeleted = (id: string) => {
      setTeams((teams) => {
        if (!teams) return teams;
        return teams.filter((e) => e.id !== id);
      });
    };
    const onTeamInserted = (newTeam: FullTeam) => {
      const existing = teams?.find((e) => e.id == newTeam.id);
      if (existing == undefined) setTeams((teams) => [...teams!, newTeam]);
    };

    const onTeamUpdated = (updatedTeam: FullTeam) => {
      setTeams((teams) => {
        if (!teams) return teams;
        return teams.filter((e) => e.id != updatedTeam.id).concat(updatedTeam);
      });
    };
    adminEmitter.on("teamDeleted", (id) => onTeamDeleted(id));
    adminEmitter.on("teamInserted", (info) => onTeamInserted(info));
    adminEmitter.on("teamUpdated", (info) => onTeamUpdated(info));
    return () => {
      adminEmitter.off("teamDeleted", (id) => onTeamDeleted(id));
      adminEmitter.off("teamInserted", (info) => onTeamInserted(info));
      adminEmitter.off("teamUpdated", (info) => onTeamUpdated(info));
    };
  }, []);

  return (
    <>
      {isList ? (
        <DataTable
          columns={columns}
          data={teams!}
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
          <TeamList teams={teams!} />
        </>
      )}
    </>
  );
};
