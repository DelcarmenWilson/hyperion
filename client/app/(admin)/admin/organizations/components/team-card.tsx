"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Team } from "@prisma/client";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

type UserCardProps = {
  team: Team;
};
export const TeamCard = ({ team }: UserCardProps) => {
  return (
    <Link
      href={`/admin/teams/${team.id}`}
      className="flex flex-col justify-center items-center p-2 gap-2 hover:bg-primary hover:text-background"
    >
      <Avatar>
        <AvatarImage src={team.logo || ""} />
        <AvatarFallback className="bg-primary">
          <User className="text-accent" />
        </AvatarFallback>
      </Avatar>
      <p className="text-sm  font-bold">{team.name}</p>
    </Link>
  );
};
