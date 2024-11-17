import React from "react";
import { Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhoneStore } from "@/hooks/use-phone";
import Link from "next/link";

import { PipelineLead } from "@/types";

import { Button } from "@/components/ui/button";

import { formatDate } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";
import { useLeadStore } from "@/hooks/lead/use-lead";

type Props = {
  lead: PipelineLead;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

export const LeadCard = ({ lead, indexRef }: Props) => {
  const { onPhoneOutOpen } = usePhoneStore();
  const { setLeadId, setConversationId } = useLeadStore();

  const onCallClick = () => {
    setLeadId(lead.id);
    setConversationId();
    onPhoneOutOpen(lead);
  };
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
            onClick={onCallClick}
          >
            <Phone size={16} />
          </Button>
          <p> Recd:{formatDate(lead.recievedAt)}</p>
        </div>
      </div>
    </div>
  );
};
