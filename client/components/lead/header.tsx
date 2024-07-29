"use client";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import { FullLeadNoConvo } from "@/types";
import { LeadDropDown } from "@/components/lead/dropdown";

type LeadHeaderProps = {
  lead: FullLeadNoConvo;
};

export const LeadHeader = ({ lead }: LeadHeaderProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  useEffect(() => {
    const onSetLead = (leadIds: string[]) => {
      if (leadIds.includes(lead.id)) redirect("/leads");
    };

    userEmitter.on("leadTransfered", onSetLead);
    socket?.on("lead-unshared-received", (data: { leadIds: string[] }) => {
      onSetLead(data.leadIds);
    });
  }, []);
  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-secondary pt-2 mt-2">
        <h3 className="text-2xl  font-bold">
          <span className="text-primary">
            {lead.firstName} {lead.lastName}
          </span>
          {" | "}
          <span className="italic text-muted-foreground mr-2">
            {lead.gender.substring(0, 1)} {lead.maritalStatus}
          </span>
        </h3>
        <LeadDropDown lead={lead} />
      </div>
    </>
  );
};
