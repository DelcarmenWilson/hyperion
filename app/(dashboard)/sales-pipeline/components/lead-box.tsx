import React from "react";
import { format } from "date-fns";
import { Clock, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/formulas/phones";
import { FullLead } from "@/types";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LeadBoxProps {
  lead: FullLead;
  bg?: string;
}

export const LeadBox = ({ lead, bg }: LeadBoxProps) => {
  const usePm = usePhoneModal();
  return (
    <div className="border-b">
      <div className={cn("flex justify-between items-center p-2 text-xs", bg)}>
        <div>
          <p>{`${lead.firstName} ${lead.lastName}`}</p>
          <Link
            className="text-primary italic font-bold"
            href={`/leads/${lead.id}`}
          >
            {formatPhoneNumber(lead.cellPhone)}
          </Link>
          <p className="flex gap-1">
            Local
            <Clock className="w-4 h-4" />: 12:41 pm
          </p>
        </div>
        <div className="flex flex-col justify-between gap-2 items-end">
          <Button
            className="rounded-full w-fit"
            onClick={() => usePm.onPhoneOutOpen(lead)}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <p> Recieved {format(lead.createdAt, "MM-dd aaaa")}</p>
        </div>
      </div>
    </div>
  );
};
