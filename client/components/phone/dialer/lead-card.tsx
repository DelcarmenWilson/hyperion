"use client";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";

import { PipelineLead } from "@/types";
import { formatDate, getAge } from "@/formulas/dates";

type LeadDialerCardProps = {
  lead: PipelineLead;
  index: number;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

export const LeadDialerCard = ({
  lead,
  index,
  indexRef,
}: LeadDialerCardProps) => {
  const { onSetIndex } = usePipelineStore();
  return (
    <div
      ref={indexRef}
      className="border-b cursor-pointer"
      onClick={() => onSetIndex(index)}
    >
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
