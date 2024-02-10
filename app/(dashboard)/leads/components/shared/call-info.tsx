"use client";
import { useEffect, useState } from "react";

import {
  MessageSquareWarning,
  MoreVertical,
  Phone,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";
import { FullLead } from "@/types";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { getLocalTime } from "@/formulas/dates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leadUpdateByIdStatus, leadUpdateByIdType } from "@/actions/lead";
import { toast } from "sonner";
interface CallInfoProps {
  lead: FullLead;
}
export const CallInfo = ({ lead }: CallInfoProps) => {
  const usePm = usePhoneModal();
  const [callCount, setCallCount] = useState(lead.calls?.length || 0);

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

  const onTypeUpdated = (e: any) => {
    leadUpdateByIdType(lead.id, e).then((data) => {
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

  return (
    <div className="flex flex-col gap-2">
      {/* <p className="text-sm">Local time : 11:31 am</p> */}
      {/* <p className="text-sm">Local time : {getLocalTime("TX")}</p> */}
      <Button
        disabled={lead.status == "Do_Not_Call"}
        className="w-fit relative"
        onClick={() => usePm.onDialerOpen(lead)}
        size="sm"
      >
        <Phone className="w-4 h-4 mr-2" />
        CLICK TO CALL
        {callCount > 0 && (
          <Badge className="absolute -top-3 -right-3 rounded-full text-xs">
            {callCount}
          </Badge>
        )}
      </Button>
      <div>
        <p className="text-muted-foreground">Type</p>
        <Select
          name="ddlLeadType"
          defaultValue={lead.type}
          onValueChange={onTypeUpdated}
        >
          <SelectTrigger>
            <SelectValue placeholder="Disposition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General">General</SelectItem>
            <SelectItem value="Final_Expense">Final Expense</SelectItem>
            <SelectItem value="Mortgage_Protection">
              Mortgage Protection
            </SelectItem>
            <SelectItem value="Iul">Iul</SelectItem>
            <SelectItem value="Sold">Annuity</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground">Status</p>
        <Select
          disabled={lead.status == "Do_Not_Call"}
          name="ddlLeadStatus"
          defaultValue={lead.status}
          onValueChange={onStatusUpdated}
        >
          <SelectTrigger>
            <SelectValue placeholder="Disposition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Attempted_to_Contact">
              Attempted to Contact
            </SelectItem>
            <SelectItem value="Not_Interest">Not Interest</SelectItem>
            <SelectItem value="Do_Not_Call">Do Not Call</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </SelectContent>
        </Select>
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
