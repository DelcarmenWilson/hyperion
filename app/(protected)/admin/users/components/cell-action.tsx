"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  Calendar,
  Copy,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert";
import { smsCreateInitial } from "@/actions/sms";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FullLead } from "@/types";

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
    await smsCreateInitial(data.id).then((data) => {
      router.refresh();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.error(data.success);
      }
    });
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
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {!data.conversation?.id && (
            <DropdownMenuItem onClick={onStartConversation}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Convo
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            Appointment
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push(`/leads/${data.id}`);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
