"use client";
import React, { useState } from "react";
import { Eye, MoreHorizontal, Phone, Share } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/user/use-current";
import { usePhoneStore } from "@/stores/phone-store";
import axios from "axios";

import { FullCall } from "@/types";
import { Call } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { shareCall } from "@/actions/call";

export const CallHistoryActions = ({ call }: { call: FullCall }) => {
  const user = useCurrentUser();
  const { onCallOpen, onPhoneOutOpen } = usePhoneStore();
  const [isShared, setIsShared] = useState(call.shared);
  if (!user) return null;
  const show: boolean = user.id == call.userId || user?.role == "MASTER";

  const onCallBack = async () => {
    //TODO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId: call.leadId,
    });
    const lead = response.data;
    onPhoneOutOpen(lead);
  };

  const OnShareToggle = () => {
    const localShared = !isShared;
    setIsShared(localShared);
    shareCall({ id: call.id, shared: localShared }).then((data) => {
      toast.success(data);
    });
  };
  if (!show) return null;
  return (
    // <div>
    //   {call.recordUrl && (
    //     <div className="flex flex-col gap-1 items-start justify-center">
    //       <AudioPlayer src={call.recordUrl} />
    //       <Button variant="link" className="p-0" onClick={OnShareToggle}>
    //         {isShared ? "Unshare" : "Share"}
    //       </Button>
    //     </div>
    //   )}
    // </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={call.recordUrl ? "default" : "ghost"} size="icon">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => onCallOpen(call)}
        >
          <Eye size={16} />
          Details
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2" onClick={onCallBack}>
          <Phone size={16} />
          Call Back
        </DropdownMenuItem>
        {call.recordUrl && (
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={OnShareToggle}
          >
            <Share size={16} />
            {isShared ? "Unshare Recording" : "Share Recording"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
