"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrentRole } from "@/hooks/user/use-current";

import { AssistantForm, UserForm } from "./form";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const UserTopMenu = () => {
  const role = useCurrentRole();
  const [isAssistantDrawerOpen, setAssistantDrawerOpen] = useState(false);
  const [isUserDrawerOpen, setUserDrawerOpen] = useState(false);

  return (
    <>
      <DrawerRight
        title={"New Assistant"}
        isOpen={isAssistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
      >
        <AssistantForm onClose={() => setAssistantDrawerOpen(false)} />
      </DrawerRight>
      <DrawerRight
        title={"New User"}
        isOpen={isUserDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
      >
        <UserForm onClose={() => setUserDrawerOpen(false)} />
      </DrawerRight>
      <div className="col-span-3 text-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {role == "SUPER_ADMIN" && (
              <Button size="sm" className="gap-2">
                <span className="sr-only">Actions menu</span>
                Actions <ChevronDown size={15} />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setUserDrawerOpen(true)}
            >
              New User
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setAssistantDrawerOpen(true)}
            >
              New Assistant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
