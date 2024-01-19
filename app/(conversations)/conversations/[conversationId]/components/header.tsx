"use client";

import { FullConversationType } from "@/types";
import { useState } from "react";
import { ProfileDrawer } from "./profile-drawer";

interface HeaderProps {
  data: FullConversationType;
}
export const Header = ({ data }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initials = `${data.lead.firstName.substring(
    0,
    1
  )} ${data.lead.lastName.substring(0, 1)}`;
  const fullName = `${data.lead.firstName} ${data.lead.lastName}`;

  return (
    <>
      <ProfileDrawer
        data={data}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex justify-between items-center border-b h-14 px-2">
        <div className="flex justify-center items-center bg-primary text-accent  rounded-full p-1 mr-2">
          <span className="text-lg font-semibold">
            <span>{initials}</span>
          </span>
        </div>
        <div className="block flex-1">
          <div className="text-lg">{fullName}</div>
        </div>
      </div>
    </>
  );
};
