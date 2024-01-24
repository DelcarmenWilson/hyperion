"use client";
import { useRouter } from "next/navigation";

import {
  MessageSquareWarning,
  MoreVertical,
  Phone,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/hooks/use-current-user";
import { callInsert } from "@/data/actions/call";
import { toast } from "sonner";
import { CallDirection } from "@prisma/client";
import { useState } from "react";
import { useDialerModal } from "@/hooks/use-dialer-modal";
import { LeadColumn } from "../columns";
interface CallProps {
  lead: LeadColumn;
  intialCallCount?: number;
}
export const Call = ({ lead, intialCallCount }: CallProps) => {
  const user = useCurrentUser();
  const useDialer = useDialerModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [callCount, setCallCount] = useState(intialCallCount || 0);

  const onStartCall = async () => {
    if (!lead.id || !user) return;
    setLoading(true);
    setCallCount((state) => (state += 1));

    await callInsert(user.id, lead.id, CallDirection.Outbound).then((data) => {
      router.refresh();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.error(data.success);
      }
    });
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Local time : 11:31 am</p>
      <Button
        className="w-fit relative"
        onClick={() => useDialer.onOpen(lead)}
        size="sm"
        disabled={loading}
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
