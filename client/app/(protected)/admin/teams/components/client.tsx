"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { FullTeam } from "@/types";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { TeamList } from "./list";

type TeamClientProps = {
  intitTeams: FullTeam[];
};
export const TeamClient = ({ intitTeams }: TeamClientProps) => {
  const [teams, setTeams] = useState(intitTeams);
  const [isList, setIsList] = useState(false);

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
      adminEmitter.on("teamDeleted", (id) => onTeamDeleted(id));
      adminEmitter.on("teamInserted", (info) => onTeamInserted(info));
      adminEmitter.on("teamUpdated", (info) => onTeamUpdated(info));
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
          topMenu={
            <ListGridTopMenu
              text="Add Team"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={() => {}}
              showButton={false}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Teams</h4>
            <ListGridTopMenu
              text="Add Team"
              setIsDrawerOpen={() => {}}
              isList={isList}
              setIsList={setIsList}
              showButton={false}
            />
          </div>
          <TeamList teams={teams!} />
        </>
      )}
    </>
  );
};
