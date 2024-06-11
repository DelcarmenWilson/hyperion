"use client";
import Link from "next/link";
import { format } from "date-fns";
import { FullTeam } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardData } from "@/components/reusable/card-data";
import { UserCard } from "./user-card";
import { User } from "lucide-react";

type TeamCardProps = {
  team: FullTeam;
};
export const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm h-[475px] gap-2">
      <Link
        className="text-2xl text-primary font-semibold text-center hover:bg-primary hover:text-background"
        href={`/admin/teams/${team.id}`}
      >
        {team.name}
      </Link>

      <div className="flex-center flex-col text-sm">
        <h4 className="text-muted-foreground">Owner</h4>
        <Avatar>
          <AvatarImage src={team.owner?.image || ""} />
          <AvatarFallback className="bg-primary">
            <User className="text-accent" />
          </AvatarFallback>
        </Avatar>
        <h4 className="font-bold">{team.owner?.firstName!}</h4>
      </div>
      <CardData label="Image" value={team.image!} />
      <CardData label="Banner" value={team.banner!} />

      <CardData label="Organization" value={team.organization.name} />
      <CardData
        label="Date Created"
        value={format(team.createdAt, "MM-dd-yyyy")}
      />
      <CardData
        label="Date Updated"
        value={format(team.updatedAt, "MM-dd-yyyy")}
      />
      {team.userId.length > 0 && (
        <div className="flex-1 flex flex-col overflow-hidden shadow-sm p-2">
          <h4 className="flex justify-between items-center text-lg font-semibold">
            Users
            <span>{team.users?.length}</span>
          </h4>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-y-auto ">
            {team.users?.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
