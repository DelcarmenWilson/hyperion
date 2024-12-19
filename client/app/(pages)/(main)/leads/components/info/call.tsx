"use client";
import { ReactNode, useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";
import { useLeadStore } from "@/stores/lead-store";

import { Phone } from "lucide-react";
import { usePhoneStore } from "@/stores/phone-store";

import { LeadCommunication } from "@prisma/client";
import { FullLead, FullLeadNoConvo } from "@/types";
import { LeadDefaultStatus } from "@/types/lead";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadStatusSelect } from "@/components/lead/select/lead-status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";

type Props = {
  info: FullLead | FullLeadNoConvo;
  showBtnCall?: boolean;
};
export const CallInfo = ({ info, showBtnCall = true }: Props) => {
  const { socket } = useContext(SocketContext).SocketState;
  const { setLeadId, setConversationId } = useLeadStore();

  const { onPhoneOutOpen } = usePhoneStore();
  const [lead, setLead] = useState<FullLead | FullLeadNoConvo>(info);
  //TODO need to intrgrate the call count again
  // const leadcount = info.calls?.filter((e) => e.direction == "outbound").length;

  // const [callCount, setCallCount] = useState(leadcount || 0);
  const [callCount, setCallCount] = useState(0);

  const onCallClick = () => {
    setLeadId(lead.id);
    setConversationId();
    onPhoneOutOpen(lead);
  };
  // useEffect(() => {
  //   const callHandler = (leadId: string | null) => {
  //     if (leadId == lead.id) setCallCount((count) => count + 1);
  //   };
  //   socket?.on("calllog:new", (data: { dt: LeadCommunication }) =>
  //     callHandler(data.dt.leadId)
  //   );
  //   return () => {
  //     socket?.off("calllog:new", (data: { dt: LeadCommunication }) =>
  //       callHandler(data.dt.leadId)
  //     );
  //   };
  // }, [lead.id]);

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
        <div className="relative w-fit">
          <Button
            className="gap-2 w-full"
            variant="gradientDark"
            disabled={lead.statusId == LeadDefaultStatus.DONOTCALL}
            onClick={onCallClick}
            size="sm"
          >
            <Phone size={16} />
            Call {lead.firstName}
          </Button>

          {callCount > 0 && (
            <Badge
              variant="gradientDark"
              className="absolute -right-6 rounded-full text-xs"
            >
              {callCount}
            </Badge>
          )}
        </div>
      )}

      <Box title="Type">
        <LeadTypeSelect id={lead.id} type={lead.type} />
      </Box>

      <Box title="Status">
        <LeadStatusSelect id={lead.id} statusId={lead.statusId} />
      </Box>

      <Box title="Vendor">
        <Input
          className="bg-background"
          value={lead.vendor.replace("_", " ")}
          readOnly
        />
      </Box>
    </div>
  );
};

const Box = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="py-1">
      <p className="text-xs italic">{title}</p>
      {children}
    </div>
  );
};
