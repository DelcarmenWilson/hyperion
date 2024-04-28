"use client";
import { Phone } from "lucide-react";
import { emitter } from "@/lib/event-emmiter";

import { usePhone } from "@/hooks/use-phone";

import { FullLeadNoConvo } from "@/types";
import { Button } from "@/components/ui/button";

import { formatPhoneNumber } from "@/formulas/phones";
import { LeadDropDown } from "@/components/lead/dropdown";
import { useState } from "react";

interface HeaderProps {
  lead: FullLeadNoConvo;
}
export const Header = ({ lead }: HeaderProps) => {
  const usePm = usePhone();
  const [isOpen, setIsOpen] = useState(false);

  const initials = `${lead.firstName.substring(0, 1)} ${lead.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${lead.firstName} ${lead.lastName}`;

  return (
    <div className="flex flex-1 justify-between items-center h-14 px-2">
      <div className="flex justify-center items-center bg-primary text-accent rounded-full p-1 mr-2">
        <span className="text-lg font-semibold">{initials}</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <span className="text-lg">
          {fullName} {formatPhoneNumber(lead.cellPhone)}
        </span>
        <Button
          disabled={lead.status == "Do_Not_Call"}
          className="rounded-full"
          variant="outlineprimary"
          size="icon"
          onClick={() => usePm.onPhoneOutOpen(lead)}
        >
          <Phone size={16} />
        </Button>

        <LeadDropDown lead={lead} />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={isOpen ? "default" : "outlineprimary"}
          size="sm"
          onClick={() =>
            setIsOpen((open) => {
              emitter.emit("toggleLeadInfo", !open);
              return !open;
            })
          }
        >
          LEAD INFO
        </Button>
      </div>
    </div>
  );
};
