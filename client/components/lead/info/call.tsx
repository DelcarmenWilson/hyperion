"use client";
import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import { Phone } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";

import { useLeadCallInfoActions } from "@/hooks/lead/use-lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type Props = {
  showBtnCall?: boolean;
};
export const CallInfo = ({ showBtnCall = true }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { onPhoneOutOpen } = usePhone();
  const { callInfo, isFetchingCallInfo } = useLeadCallInfoActions();
  if (!callInfo) return null;
  const callCount = callInfo.calls?.filter(
    (e) => e.direction == "outbound"
  ).length;

  return (
    <div className="flex flex-col">
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}
      <SkeletonWrapper isLoading={isFetchingCallInfo}>
        {showBtnCall && (
          <div className="relative w-fit ">
            <Button
              className="gap-2"
              disabled={callInfo.status == "Do_Not_Call"}
              onClick={() => onPhoneOutOpen()}
              size="sm"
            >
              <Phone size={16} />
              CLICK TO CALL
            </Button>

            {callCount > 0 && (
              <Badge className="absolute -right-6 rounded-full text-xs">
                {callCount}
              </Badge>
            )}
          </div>
        )}
        <div className="text-sm">
          <div className="py-1">
            <p>Type</p>
            <LeadTypeSelect id={callInfo.id} type={callInfo.type} />
          </div>

          <div className="py-1">
            <p>Status</p>
            <LeadStatusSelect id={callInfo.id} status={callInfo.status} />
          </div>
        </div>
      </SkeletonWrapper>
    </div>
  );
};
