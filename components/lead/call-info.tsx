"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { leadUpdateByIdStatus, leadUpdateByIdType } from "@/actions/lead";
import { useGlobalContext } from "@/providers/global";

interface CallInfoProps {
  info: FullLead | FullLeadNoConvo;
  showBtnCall?: boolean;
}
export const CallInfo = ({ info, showBtnCall = true }: CallInfoProps) => {
  const usePm = usePhone();
  const [lead, setLead] = useState<FullLead | FullLeadNoConvo>(info);
  const leadcount = info.calls?.filter((e) => e.direction == "outbound");

  const [callCount, setCallCount] = useState(leadcount?.length || 0);
  const { leadStatus } = useGlobalContext();

  const onStatusUpdated = (e: any) => {
    leadUpdateByIdStatus(lead.id, e).then((data) => {
      if (data.error) {
        toast.success(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  const onTypeUpdated = (type: string) => {
    leadUpdateByIdType(lead.id, type).then((data) => {
      if (data.error) {
        toast.success(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  useEffect(() => {
    pusherClient.subscribe(lead.id as string);

    const callHandler = () => {
      setCallCount((current) => {
        return current + 1;
      });
    };
    pusherClient.bind("call:new", callHandler);
    return () => {
      pusherClient.unsubscribe(lead.id as string);
      pusherClient.unbind("call:new", callHandler);
    };
  }, [lead.id]);

  useEffect(() => {
    setLead(info);
  }, [info]);

  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}

      {showBtnCall && (
        <div className="relative w-fit">
          <Button
            disabled={lead.status == "Do_Not_Call"}
            onClick={() => usePm.onPhoneOutOpen(lead)}
            size="sm"
          >
            <Phone className="w-4 h-4 mr-2" />
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
      <div>
        {/* <Badge
          className="flex gap-1 w-fit mb-2 "
          variant="outlinedestructive"
        >
          <MessageSquareWarning className="w-4 h-4" />
          <span> No SMS drips</span>
          <XCircle className="w-4 h-4" />
        </Badge>
        <Badge className="flex gap-1 w-fit" variant="outlinedestructive">
          <MessageSquareWarning className="w-4 h-4" />
          <span> No email drips</span>
          <XCircle className="w-4 h-4" />
        </Badge> */}
      </div>
    </div>
  );
};
