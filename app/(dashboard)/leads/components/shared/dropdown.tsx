"use client";
import { cn } from "@/lib/utils";
import { Calendar, Check, ChevronDown, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { LeadColumn } from "../columns";
import { useState } from "react";
import { leadUpdateByIdAutoChat } from "@/actions/lead";
import { toast } from "sonner";

interface DropDownDrops {
  lead: LeadColumn;
}

export const DropDown = ({ lead }: DropDownDrops) => {
  const useAppointment = useAppointmentModal();
  const [autoChat, setAutoChat] = useState(lead.autoChat);

  const onAutoChatToggle = () => {
    setAutoChat((state) => !state);
    leadUpdateByIdAutoChat(lead.id, !autoChat).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="rounded-full" size="icon">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="center">
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => useAppointment.onOpen(lead)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          New Appointment
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            " text-background cursor-pointer",
            autoChat ? "bg-primary" : "bg-destructive"
          )}
          onClick={onAutoChatToggle}
        >
          <div className="flex items-center justify-between gap-2">
            {autoChat ? (
              <Check className="w-4 h-4 " />
            ) : (
              <X className="w-4 h-4 " />
            )}
            <span>Hyper Chat</span>
            <span>{autoChat ? "ON" : "OFF"}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
