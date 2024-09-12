import React from "react";
import { cn } from "@/lib/utils";

import { FullLead } from "@/types";
import { formatDate, getAge } from "@/formulas/dates";

type LeadDialerCardProps = {
  lead: FullLead;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

export const LeadDialerCard = ({ lead, indexRef }: LeadDialerCardProps) => {
  return (
    <div ref={indexRef} className="border-b">
      <div
        className={cn("p-2 hover:bg-primary/25", indexRef && "bg-primary/30")}
      >
        <div className="text-center text-muted-foreground">
          <p className="font-bold">{`${lead.firstName} ${lead.lastName}`}</p>
        </div>
        <div className="flex justify-between items-center text-xs">
          <div>
            <p>State: {lead.state}</p>
            <p>Status: {lead.maritalStatus}</p>
          </div>
          <div>
            <p>Age: {getAge(lead.dateOfBirth)}</p>
            <p> Recd {formatDate(lead.recievedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
