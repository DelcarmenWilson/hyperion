"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { userEmitter } from "@/lib/event-emmiter";

import { Phone } from "lucide-react";
import { usePhone } from "@/hooks/use-phone";
import { allLeadTypes } from "@/constants/lead";

import { pusherClient } from "@/lib/pusher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FullLead, FullLeadNoConvo } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadUpdateByIdType } from "@/actions/lead";
import { leadUpdateByIdStatus } from "@/actions/lead/status";
import { useGlobalContext } from "@/providers/global";

interface CallInfoProps {
  info: FullLead | FullLeadNoConvo;
  showBtnCall?: boolean;
}
export const CallInfo = ({ info, showBtnCall = true }: CallInfoProps) => {
  const usePm = usePhone();
  const [lead, setLead] = useState<FullLead | FullLeadNoConvo>(info);
  const leadcount = info.calls?.filter((e) => e.direction == "outbound").length;

  const [callCount, setCallCount] = useState(leadcount || 0);
  const { leadStatus } = useGlobalContext();

  const onStatusUpdated = async (e: string) => {
    const reponse = await leadUpdateByIdStatus(lead.id, e);
    if (reponse.success) {
      userEmitter.emit("leadStatusChanged", lead.id, e);
      toast.success(reponse.success);
    } else toast.error(reponse.error);
  };

  const onTypeUpdated = async (type: string) => {
    const reponse = await leadUpdateByIdType(lead.id, type);
    if (reponse.success) toast.success(reponse.success);
    else toast.error(reponse.error);
  };

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
      <div className="text-muted-foreground text-sm space-y-2">
        <div className="flex items-center gap-2">
          <p>Type</p>
          <Select
            name="ddlLeadType"
            defaultValue={lead.type}
            onValueChange={onTypeUpdated}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lead Type" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {allLeadTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p>Status</p>
          <Select
            disabled={lead.status == "Do_Not_Call"}
            name="ddlLeadStatus"
            defaultValue={lead.status}
            onValueChange={onStatusUpdated}
          >
            <SelectTrigger>
              <SelectValue placeholder="Disposition" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {leadStatus?.map((status) => (
                <SelectItem key={status.id} value={status.status}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div></div>
    </div>
  );
};
