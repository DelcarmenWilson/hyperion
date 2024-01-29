import { Button } from "@/components/ui/button";
import { useDialerModal } from "@/hooks/use-dialer-modal";
import { Clock, Phone } from "lucide-react";
import React from "react";
import { LeadColumn } from "../../leads/components/columns";
import { format } from "date-fns";
import { formatPhoneNumber } from "@/formulas/phones";

interface LeadBoxProps {
  lead: LeadColumn;
}

export const LeadBox = ({ lead }: LeadBoxProps) => {
  const useDialer = useDialerModal();
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
            onClick={() => useDialer.onOpen(lead)}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <p> Recieved {format(lead.createdAt, "MM-dd aaaa")}</p>
        </div>
      </div>
    </div>
  );
};
