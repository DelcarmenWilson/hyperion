"use client";
import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore } from "@/hooks/lead/use-lead";

import { Phone } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";

import { Call } from "@prisma/client";
import { FullLead, FullLeadNoConvo } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";

type Props = {
  info: FullLead | FullLeadNoConvo;
  showBtnCall?: boolean;
};
export const CallInfo = ({ info, showBtnCall = true }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { setLeadId, setConversationId } = useLeadStore();

  const { onPhoneOutOpen } = usePhone();
  const [lead, setLead] = useState<FullLead | FullLeadNoConvo>(info);

  const leadcount = info.calls?.filter((e) => e.direction == "outbound").length;

  const [callCount, setCallCount] = useState(leadcount || 0);

  const onCallClick = () => {
    setLeadId(lead.id);
    setConversationId();
    onPhoneOutOpen(lead);
  };
  useEffect(() => {
    const callHandler = (leadId: string | null) => {
      if (leadId == lead.id) setCallCount((count) => count + 1);
    };
    socket?.on("calllog:new", (data: { dt: Call }) =>
      callHandler(data.dt.leadId)
    );
    return () => {
      socket?.off("calllog:new", (data: { dt: Call }) =>
        callHandler(data.dt.leadId)
      );
    };
  }, [lead.id]);

  useEffect(() => {
    setLead(info);
    const onLeadStatusChanged = (leadId: string, newStatus: string) => {
      if (leadId == lead.id) {
        setLead((lead) => {
          return { ...lead, status: newStatus };
        });
      }
    };
    const onSetCallCount = (leadId: string) => {
      if (leadId == info.id) setCallCount((ct) => ct + 1);
    };

    userEmitter.on("leadStatusChanged", (leadId, newStatus) =>
      onLeadStatusChanged(leadId, newStatus)
    );
    userEmitter.on("newCall", (leadId) => onSetCallCount(leadId));
    return () => {
      userEmitter.off("leadStatusChanged", (leadId, newStatus) =>
        onLeadStatusChanged(leadId, newStatus)
      );
      userEmitter.off("newCall", (leadId) => onSetCallCount(leadId));
    };
  }, [info]);

  return (
    <div className="flex flex-col">
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}

      {showBtnCall && (
        <div className="relative w-fit ">
          <Button
            className="gap-2"
            disabled={lead.status == "Do_Not_Call"}
            onClick={onCallClick}
            size="sm"
          >
            <Phone size={16} />
            Call {lead.firstName}
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
          <LeadTypeSelect id={lead.id} type={lead.type} />
        </div>

        <div className="py-1">
          <p>Status</p>
          <LeadStatusSelect id={lead.id} status={lead.status} />
        </div>
      </div>
    </div>
  );
};