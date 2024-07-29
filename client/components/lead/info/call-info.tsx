"use client";
import { useEffect, useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";

import { Phone } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";

import { pusherClient } from "@/lib/pusher";

import { FullLead, FullLeadNoConvo } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LeadStatusSelect } from "@/components/lead/select/status-select";
import { LeadTypeSelect } from "@/components/lead/select/type-select";

type Props = {
  info: FullLead | FullLeadNoConvo;
  showBtnCall?: boolean;
};
export const CallInfo = ({ info, showBtnCall = true }: Props) => {
  const usePm = usePhone();
  const [lead, setLead] = useState<FullLead | FullLeadNoConvo>(info);
  const leadcount = info.calls?.filter((e) => e.direction == "outbound").length;

  const [callCount, setCallCount] = useState(leadcount || 0);

  useEffect(() => {
    pusherClient.subscribe(lead.id as string);

    const callHandler = () => {
      setCallCount((count) => count + 1);
    };
    pusherClient.bind("call:new", callHandler);
    return () => {
      pusherClient.unsubscribe(lead.id as string);
      pusherClient.unbind("call:new", callHandler);
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
    <div className="flex flex-col gap-2">
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}

      {showBtnCall && (
        <div className="relative w-fit">
          <Button
            className="gap-2"
            disabled={lead.status == "Do_Not_Call"}
            onClick={() => usePm.onPhoneOutOpen(lead)}
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
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          <p className="w-[80px]">Type</p>
          <LeadTypeSelect id={lead.id} type={lead.type} />
        </div>
        <div className="flex items-center gap-2">
          <p className="w-[80px]">Status</p>
          <LeadStatusSelect id={lead.id} status={lead.status} />
        </div>
      </div>
    </div>
  );
};
