"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import axios from "axios";
import { cn } from "@/lib/utils";
import { Calendar, Check, ChevronDown, Trash, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAppointmentModal } from "@/hooks/use-appointment-modal";

import { AlertModal } from "@/components/modals/alert-modal";
import { FullLeadNoConvo } from "@/types";
import { conversationUpdateByIdAutoChat } from "@/actions/conversation";
import { Conversation } from "@prisma/client";

type DropDownDrops = {
  lead: FullLeadNoConvo;
  conversation?: Conversation;
};

export const DropDown = ({ lead, conversation }: DropDownDrops) => {
  const router = useRouter();
  const useAppointment = useAppointmentModal();
  const [autoChat, setAutoChat] = useState<boolean>(conversation?.autoChat!);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onHyperChatToggle = () => {
    setAutoChat((state) => !state);
    conversationUpdateByIdAutoChat(lead.id, !autoChat).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/conversations/${conversation?.id}`);
      router.refresh();
      router.push("/inbox");
      toast.success("Conversation deleted.");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon">
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="center">
          <DropdownMenuItem
            disabled={lead.status == "Do_Not_Call"}
            className="cursor-pointer"
            onClick={() => useAppointment.onOpen(lead)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            New Appointment
          </DropdownMenuItem>
          {conversation?.id && (
            <DropdownMenuItem
              className={cn(
                " text-background cursor-pointer",
                autoChat ? "bg-primary" : "bg-destructive"
              )}
              onClick={onHyperChatToggle}
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
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setAlertOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
