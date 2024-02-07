import React from "react";
import { format } from "date-fns";
import { Clock, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/formulas/phones";
import { FullLead } from "@/types";
import { usePhoneModal } from "@/hooks/use-phone-modal";

interface LeadBoxProps {
  lead: FullLead;
}

export const LeadBox = ({ lead }: LeadBoxProps) => {
  const usePm = usePhoneModal();
  return (
    <div className="border-b">
      <div className="flex justify-between items-center p-2 text-xs">
        <div>
          <p>{`${lead.firstName} ${lead.lastName}`}</p>
          <p className="text-primary italic font-bold">
            {formatPhoneNumber(lead.cellPhone)}
          </p>
          <p className="flex gap-1">
            Local
            <Clock className="w-4 h-4" />: 12:41 pm
          </p>
        </div>
        <div className="flex flex-col justify-between gap-2 items-end">
          <Button
            className="rounded-full w-fit"
            onClick={() => usePm.onDialerOpen(lead)}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <p> Recieved {format(lead.createdAt, "MM-dd aaaa")}</p>
        </div>
      </div>
    </div>
  );
};
