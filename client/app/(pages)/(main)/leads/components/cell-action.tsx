"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/user/use-current";

import { toast } from "sonner";

import { Calendar, Copy, Eye, MoreHorizontal, Trash } from "lucide-react";

import { FullLead } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";

import { messageCreateInitial } from "@/actions/lead/message";

interface CellActionProps {
  data: FullLead;
}
export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onStartConversation = async () => {
    // toast.success(data.id);
    // return;
    const insertedSms = await messageCreateInitial(data.id);

    if (insertedSms?.success) {
      toast.error(insertedSms.success);
    } else toast.error(insertedSms.error);

    router.refresh();
  };

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Lead id copied to the clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/leads/${data.id}`);
      router.refresh();
      toast.success("Lead deleted.");
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* {!data.conversationId && (
            <DropdownMenuItem onClick={onStartConversation}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Convo
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem className="gap-2" onClick={onCopy}>
            <Copy size={16} />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Calendar size={16} />
            Appointment
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => {
              router.push(`/leads/${data.id}`);
            }}
          >
            <Eye size={16} />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
