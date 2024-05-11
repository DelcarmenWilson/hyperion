import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { formatPhoneNumber } from "@/formulas/phones";
import { getAge } from "@/formulas/dates";
import { FullLead } from "@/types";

type LeadDialerCardProps = {
  lead: FullLead;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

export const LeadDialerCard = ({ lead, indexRef }: LeadDialerCardProps) => {
  return (
    <div ref={indexRef} className="border-b">
      <div className={cn("p-2", indexRef && "bg-secondary")}>
        <div className="text-center">
          <p className="font-bold">{`${lead.firstName} ${lead.lastName}`}</p>
          <p className="text-primary italic font-bold">
            {formatPhoneNumber(lead.cellPhone)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p>State: {lead.state}</p>
            <p>Status: {lead.maritalStatus}</p>
          </div>
          <div>
            <p>Age: {getAge(lead.dateOfBirth)}</p>
            <p> Recieved: {format(lead.createdAt, "MMM dd")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
