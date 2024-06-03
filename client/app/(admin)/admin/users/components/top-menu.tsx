"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { Team, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { AssistantForm } from "./form";

type UserTopMenuProps = {
  teams: Team[];
  admins: User[];
};
export const UserTopMenu = ({ teams, admins }: UserTopMenuProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onAssitantCreated = (e?: User) => {
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Assistant"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <AssistantForm
          teams={teams}
          admins={admins}
          onClose={onAssitantCreated}
        />
      </DrawerRight>
      <div className="col-span-3 text-end">
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Assistant
        </Button>
      </div>
    </>
  );
};
