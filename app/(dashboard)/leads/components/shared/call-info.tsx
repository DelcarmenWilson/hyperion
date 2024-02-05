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
import { useDialerModal } from "@/hooks/use-dialer-modal";
import { pusherClient } from "@/lib/pusher";
import { FullLead } from "@/types";
interface CallInfoProps {
  lead: FullLead;
}
export const CallInfo = ({ lead }: CallInfoProps) => {
  const useDialer = useDialerModal();
  const [callCount, setCallCount] = useState(lead.callCount || 0);

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
      <p className="text-sm">Local time : 11:31 am</p>
      <Button
        className="w-fit relative"
        onClick={() => useDialer.onOpen(lead)}
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

      <Button className="w-fit" size="sm">
        <MoreVertical className="w-4 h-4 mr-2" />
        DISPOSITION
      </Button>
      <div>
        <Badge
          className="flex gap-1 w-fit   mb-2 "
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
        </Badge>
      </div>
    </div>
  );
};
