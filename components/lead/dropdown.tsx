"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import axios from "axios";
import { cn } from "@/lib/utils";
import {
  BookText,
  Calendar,
  Check,
  ChevronDown,
  Download,
  FileBarChart,
  FileText,
  Trash,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useAppointmentModal } from "@/hooks/use-appointment-modal";

import { AlertModal } from "@/components/modals/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IntakeForm } from "@/components/lead/forms/intake-form";
import { FullLeadNoConvo } from "@/types";
import { conversationUpdateByIdAutoChat } from "@/actions/conversation";
import { Conversation } from "@prisma/client";
import { exportLeads } from "@/lib/xlsx";
import { useCurrentRole } from "@/hooks/user-current-role";

type DropDownProps = {
  lead: FullLeadNoConvo;
  conversation?: Conversation;
};

export const LeadDropDown = ({ lead, conversation }: DropDownProps) => {
  const router = useRouter();
  const role = useCurrentRole();
  const useAppointment = useAppointmentModal();
  const [autoChat, setAutoChat] = useState<boolean>(conversation?.autoChat!);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onHyperChatToggle = () => {
    setAutoChat((state) => !state);
    conversationUpdateByIdAutoChat(conversation?.id as string, !autoChat).then(
      (data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      }
    );
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

  const preExport = (fileType: string) => {
    if (role == "ASSISTANT") {
      toast.error("Not Authorized");
      return;
    }
    exportLeads(fileType, [lead]);
  };
  return (
    <>
      {/* <Button
      disabled={lead.status == "Do_Not_Call"}
      className="cursor-pointer rounded-full"
      size="icon"
      onClick={() => useAppointment.onOpen(lead)}
    >
      <Calendar size={16} />
    </Button>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start h-full max-w-screen-lg">
          <h3 className="text-2xl font-semibold py-2">
            Intake Form -{" "}
            <span className="text-primary">{`${lead.firstName} ${lead.lastName}`}</span>
          </h3>
          <IntakeForm lead={lead} />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            disabled={lead.status == "Do_Not_Call"}
            className="cursor-pointer gap-2"
            onClick={() => useAppointment.onOpen(lead)}
          >
            <Calendar size={16} />
            New Appointment
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <BookText size={16} />
            Intake Form
          </DropdownMenuItem>
          {conversation?.id && (
            <DropdownMenuItem
              className={cn(
                " text-background cursor-pointer gap-2",
                autoChat ? "bg-primary" : "bg-destructive"
              )}
              onClick={onHyperChatToggle}
            >
              <div className="flex items-center justify-between gap-2">
                {autoChat ? <Check size={16} /> : <X size={16} />}
                <span>Hyper Chat</span>
                <span>{autoChat ? "ON" : "OFF"}</span>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => preExport("Excel")}
                >
                  <FileBarChart size={16} />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => preExport("Pdf")}
                >
                  <FileText size={16} />
                  Pdf
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
