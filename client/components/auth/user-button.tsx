"use client";
import { Cog, Lock, LogOut, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "./logout-button";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();
  if (!user) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="bg-primary dark:bg-accent">
            <User className="text-accent dark:text-primary" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span>
            {user.name}
            {(user.role == "MASTER" || user.role == "ADMIN") &&
              ` - [${user.role.toLocaleLowerCase()}]`}
          </span>

          <span className="text-muted-foreground text-xs">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(user.role == "MASTER" || user.role == "ADMIN") && (
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => router.push("/admin/teams")}
          >
            <Lock size={16} />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => router.push("/settings")}
        >
          <Cog size={16} />
          Settings
        </DropdownMenuItem>
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
