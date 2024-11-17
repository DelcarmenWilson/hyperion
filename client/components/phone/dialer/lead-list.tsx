"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";
import { usePhoneStore } from "@/hooks/use-phone";

import { PipelineLead } from "@/types";

import { TextGroup } from "@/components/reusable/text-group";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatDate, getAge } from "@/formulas/dates";

export const LeadList = () => {
  const { setLeadId } = useLeadStore();
  const { onSetLead } = usePhoneStore();
  const { pipeIndex, filterLeads } = usePipelineStore();

  const indexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterLeads) return;
    onSetLead(filterLeads[pipeIndex]);
    // setLeadId(filterLeads[pipeIndex].id);
    console.log(filterLeads,pipeIndex)
    if (!indexRef.current) return;
    indexRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
    });
  }, [pipeIndex, filterLeads]);

  return (
    <ScrollArea className="h-full pr-2">
      {filterLeads?.map((lead, i) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          index={i}
          indexRef={i == pipeIndex ? indexRef : null}
        />
      ))}
    </ScrollArea>
  );
};

type LeadDialerCardProps = {
  lead: PipelineLead;
  index: number;
  indexRef?: React.RefObject<HTMLDivElement> | null;
};

const LeadCard = ({ lead, index, indexRef }: LeadDialerCardProps) => {
  const { onSetIndex } = usePipelineStore();
  return (
    <div
      ref={indexRef}
      className="cursor-pointer shadow-sm hover:shadow-lg"
      onClick={() => onSetIndex(index)}
    >
      <div
        className={cn(
          "p-2 hover:bg-primary/15",
          indexRef && "bg-primary/15 shadow-lg"
        )}
      >
        <p className="text-center font-bold">{`${lead.firstName} ${lead.lastName}`}</p>
        <div className="flex justify-between items-center text-xs">
          <div>
            <TextGroup label="State" value={lead.state} />
            <TextGroup label="Status" value={lead.maritalStatus} />
          </div>
          <div>
            <TextGroup label="Age" value={getAge(lead.dateOfBirth)} />
            <TextGroup label="Recd" value={formatDate(lead.recievedAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};
