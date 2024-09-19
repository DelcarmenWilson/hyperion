import React from "react";
import { Clock, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/formulas/phones";
import { FullLead } from "@/types";
import { usePhone } from "@/hooks/use-phone";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/formulas/dates";

type LeadCardProps = {
  lead: FullLead;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

export const LeadCard = ({ lead, indexRef }: LeadCardProps) => {
  const { onPhoneOutOpen } = usePhone();
  return (
    <div ref={indexRef} className="border-b">
      <div
        className={cn(
          "flex justify-between items-center p-2 text-xs",
          indexRef && "bg-primary/10"
        )}
      >
        <div>
          <p className=" text-sm text-bold">{`${lead.firstName} ${lead.lastName}`}</p>
          <Link
            className="text-primary italic font-bold"
            href={`/leads/${lead.id}`}
          >
            {formatPhoneNumber(lead.cellPhone)}
          </Link>
          <p className="flex gap-1">
            State: {lead.state}
            <Clock size={16} /> {lead.time}
          </p>
        </div>
        <div className="flex flex-col justify-between gap-2 items-end">
          <Button
            variant="transparent"
            className="rounded-full w-fit"
            onClick={() => onPhoneOutOpen(lead)}
          >
            <Phone size={16} />
          </Button>
          <p> Recd:{formatDate(lead.recievedAt)}</p>
        </div>
      </div>
    </div>
  );
};
