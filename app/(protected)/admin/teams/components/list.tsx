"use client";
import { cn } from "@/lib/utils";
import { TeamCard } from "./card";
import { FullTeam } from "@/types";

type TeamListProps = {
  teams: FullTeam[];
  size?: string;
};
export const TeamList = ({ teams, size = "full" }: TeamListProps) => {
  return (
    <>
      {teams.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Teams Found</p>
        </div>
      )}
    </>
  );
};
