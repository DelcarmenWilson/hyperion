"use client";
import { Phone } from "lucide-react";
import { userEmitter } from "@/lib/event-emmiter";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { formatPhoneNumber } from "@/formulas/phones";
import { LeadDropDown } from "@/components/lead/dropdown";
import { useState } from "react";

interface HeaderProps {
  user: User;
}
export const Header = ({ user }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const initials = `${user.firstName.substring(0, 1)} ${user.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-1 justify-between items-center h-14 gap-2 px-2">
      {/* <div className="flex justify-center items-center bg-primary text-accent rounded-full p-1 mr-2">
        <span className="text-lg font-semibold">{initials}</span>
      </div> */}
      <div className="flex-center  h-10 w-10 text-lg font-bold bg-primary text-accent rounded-full">
        {initials}
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-lg">{fullName}</span>
        {/* <Button
          disabled={lead.status == "Do_Not_Call"}
          className="rounded-full"
          variant="outlineprimary"
          size="icon"
          onClick={() => usePm.onPhoneOutOpen(lead)}
        >
          <Phone size={16} />
        </Button> */}

        {/* <LeadDropDown lead={lead} /> */}
      </div>
      <div className="flex items-center gap-2">
        {/* <Button
          variant={isOpen ? "default" : "outlineprimary"}
          size="sm"
          onClick={() =>
            setIsOpen((open) => {
              userEmitter.emit("toggleLeadInfo", !open);
              return !open;
            })
          }
        >
          LEAD INFO
        </Button> */}
      </div>
    </div>
  );
};
