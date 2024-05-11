"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type UserCardProps = {
  user: User;
};
export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="flex flex-col justify-center items-center p-2 gap-2 hover:bg-primary hover:text-background"
    >
      <Avatar>
        <AvatarImage src={user.image || ""} />
        <AvatarFallback className="bg-primary">
          <UserIcon className="text-accent" />
        </AvatarFallback>
      </Avatar>
      <p className="text-sm  font-bold">{user.userName}</p>
    </Link>
  );
};
