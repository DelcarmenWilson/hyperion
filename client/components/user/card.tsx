import React from "react";
import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@prisma/client";

type UserCardProps = {
  user: User;
  setSelectedUser: (e: string) => void;
};
export const UserCard = ({ user, setSelectedUser }: UserCardProps) => {
  return (
    <button
      onClick={() => setSelectedUser(user.id)}
      className="flex border items-center rounded hover:bg-secondary p-2 cursor-pointer w-full"
    >
      <Avatar>
        <AvatarImage src={user.image || ""} />
        <AvatarFallback className="bg-primary dark:bg-accent">
          <UserIcon className="text-accent dark:text-primary" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 px-2 text-center">
        <p className="text-lg font-bold">{user.userName}</p>
        <p className="text-sm text-muted-foreground">
          {user.firstName} {user.lastName}
        </p>
      </div>
    </button>
  );
};
