"use client";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import { LeadDropDown } from "@/components/lead/dropdown";
import { useLeadData } from "@/hooks/lead/use-lead";
import SkeletonWrapper from "../skeleton-wrapper";
import { EmptyData } from "./info/empty-data";

export const LeadHeader = () => {
  const { lead, isFetchingLead } = useLeadData();
  const { socket } = useContext(SocketContext).SocketState;
  console.log(lead);
  useEffect(() => {
    const onSetLead = (leadIds: string[]) => {
      if (leadIds.includes(lead?.id!)) redirect("/leads");
    };

    userEmitter.on("leadTransfered", onSetLead);
    socket?.on("lead-unshared-received", (data: { leadIds: string[] }) => {
      onSetLead(data.leadIds);
    });
    return () => {
      userEmitter.off("leadTransfered", onSetLead);
      socket?.off("lead-unshared-received", (data: { leadIds: string[] }) => {
        onSetLead(data.leadIds);
      });
    };
  }, []);
  return (
    <SkeletonWrapper isLoading={isFetchingLead}>
      {lead ? (
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
          <LeadDropDown
            lead={lead}
            conversationId={
              lead.conversations?.length ? lead.conversations[0].id : undefined
            }
          />
        </div>
      ) : (
        <EmptyData height="auto" />
      )}
    </SkeletonWrapper>
  );
};
