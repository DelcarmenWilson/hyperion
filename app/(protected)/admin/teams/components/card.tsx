"use client";
import { format } from "date-fns";
import { FullTeam } from "@/types";
import { CardData } from "@/components/reusable/card-data";

type TeamCardProps = {
  team: FullTeam;
};
export const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
      <h3 className="text-2xl text-primary font-semibold text-center">{`${team.name}`}</h3>

      <CardData title="Image" value={team.image!} />
      <CardData title="Banner" value={team.banner!} />

      <CardData title="Organization" value={team.organization.name} />
      <CardData title="Owner" value={team.owner?.firstName!} />
      <CardData title="Owner Image" value={team.owner?.image!} />
      <CardData
        title="Date Created"
        value={format(team.createdAt, "MM-dd-yyyy")}
      />
      <CardData
        title="Date Updated"
        value={format(team.updatedAt, "MM-dd-yyyy")}
      />
      {team.userId.length > 0 && (
        <div className="border p-2">
          <h4 className="flex justify-between items-center text-lg font-semibold">
            Users
            <span>{team.users?.length}</span>
          </h4>
          {team.users?.map((user) => (
            <div key={user.id}>
              <p>{user.userName}</p>
              <p>{user.image}</p>
              <p>{user.image}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
