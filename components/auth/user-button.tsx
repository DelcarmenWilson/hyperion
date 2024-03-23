"use client";
import { Cog, Lock, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
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
            className="cursor-pointer"
            onClick={() => router.push("/admin/teams")}
          >
            <Lock className="h-4 w-4 mr-2" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <Cog className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="h-4 w-4 mr-2" />
            LogOut
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
