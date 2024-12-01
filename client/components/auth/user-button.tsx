"use client";
import { Cog, Lock, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/user/use-current";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "./logout-button";

import { ALLADMINS } from "@/constants/user";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();
  if (!user) {
    return null;
  }
  const isAdmin = ALLADMINS.includes(user.role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.image || ""} loading="lazy" />
          <AvatarFallback className="bg-primary dark:bg-accent">
            <User className="text-accent dark:text-primary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span>
            {user.name}
            {isAdmin &&
              ` - [${user.role.toLocaleLowerCase().replace("_", " ")}]`}
          </span>

          <span className="text-muted-foreground text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => router.push(`/users/${user.id}`)}
        >
          <User size={16} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => router.push("/settings")}
        >
          <Cog size={16} />
          Settings
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => router.push("/admin/teams")}
          >
            <Lock size={16} />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem className="gap-2">
            <LogOut size={16} />
            LogOut
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
