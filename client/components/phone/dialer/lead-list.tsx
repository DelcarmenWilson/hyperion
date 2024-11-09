"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { LeadDialerCard } from "./lead-card";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePhoneStore } from "@/hooks/use-phone";

export const LeadList = () => {
  const { setLeadId } = useLeadStore();
  const { onSetLead } = usePhoneStore();
  const { pipeIndex, filterLeads } = usePipelineStore();

  const indexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterLeads) return;
    onSetLead(filterLeads[pipeIndex]);
    setLeadId(filterLeads[pipeIndex].id);
    if (!indexRef.current) return;
    indexRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
    });
  }, [pipeIndex, filterLeads]);

  return (
    <ScrollArea className="h-full pr-2">
      {filterLeads?.map((lead, i) => (
        <LeadDialerCard
          key={lead.id}
          lead={lead}
          index={i}
          indexRef={i == pipeIndex ? indexRef : null}
        />
      ))}
    </ScrollArea>
  );
};
