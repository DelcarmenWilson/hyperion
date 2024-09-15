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
  const { leadBasic, isFetchingLeadBasic } = useLeadData();
  const { socket } = useContext(SocketContext).SocketState;
  useEffect(() => {
    const onSetLead = (leadIds: string[]) => {
      if (leadIds.includes(leadBasic?.id!)) redirect("/leads");
    };

    userEmitter.on("leadTransfered", onSetLead);
    socket?.on("lead-unshared-received", (data: { leadIds: string[] }) => {
      onSetLead(data.leadIds);
    });
  }, []);
  return (
    <SkeletonWrapper isLoading={isFetchingLeadBasic}>
      {leadBasic ? (
        <div className="flex justify-center items-center gap-2 bg-secondary pt-2 mt-2">
          <h3 className="text-2xl  font-bold">
            <span className="text-primary">
              {leadBasic.firstName} {leadBasic.lastName}
            </span>
            {" | "}
            <span className="italic text-muted-foreground mr-2">
              {leadBasic.gender.substring(0, 1)} {leadBasic.maritalStatus}
            </span>
          </h3>
          <LeadDropDown />
        </div>
      ) : (
        <EmptyData height="auto" />
      )}
    </SkeletonWrapper>
  );
};
