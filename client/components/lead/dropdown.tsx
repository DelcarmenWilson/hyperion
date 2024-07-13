"use client";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  BookText,
  Calendar,
  Check,
  ChevronDown,
  FileBarChart,
  FileText,
  Reply,
  Share,
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

import { useAppointment } from "@/hooks/use-appointment";

import { AlertModal } from "@/components/modals/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IntakeForm } from "@/components/lead/forms/intake/intake-form";
import { FullLeadNoConvo } from "@/types";
import {
  conversationDeleteById,
  conversationUpdateByIdAutoChat,
} from "@/actions/conversation";
import { Conversation } from "@prisma/client";
import { exportLeads } from "@/lib/xlsx";
import { useCurrentRole } from "@/hooks/user-current-role";
import { TransferForm } from "./forms/transfer-form";
import { useLead } from "@/hooks/use-lead";

type DropDownProps = {
  lead: FullLeadNoConvo;
  conversation?: Conversation;
};

export const LeadDropDown = ({ lead, conversation }: DropDownProps) => {
  const role = useCurrentRole();
  const { onFormOpen } = useAppointment();
  const { onShareFormOpen, onTransferFormOpen, onIntakeFormOpen } = useLead();
  const [autoChat, setAutoChat] = useState<boolean>(conversation?.autoChat!);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const isAssistant = role == "ASSISTANT";
  const leadFullName = `${lead.firstName} ${lead.lastName}`;

  const onTitanToggle = async () => {
    setAutoChat((state) => !state);
    const updateAutoChat = await conversationUpdateByIdAutoChat(
      conversation?.id as string,
      !autoChat
    );

    if (updateAutoChat.success) toast.success(updateAutoChat.success);
    else toast.error(updateAutoChat.error);
  };

  const onDelete = async () => {
    setLoading(true);
    const deletedConversation = await conversationDeleteById(
      conversation?.id as string
    );
    if (deletedConversation.success) toast.success(deletedConversation.success);
    else toast.error(deletedConversation.error);
    setLoading(false);
    setAlertOpen(false);
  };

  const preExport = (fileType: string) => {
    if (isAssistant) {
      toast.error("Not Authorized");
      return;
    }
    exportLeads(fileType, [lead], `${lead.firstName} ${lead.lastName}`);
  };
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        height="h-auto"
      />

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
            onClick={() => onFormOpen(lead)}
          >
            <Calendar size={16} />
            New Appointment
          </DropdownMenuItem>
          {!isAssistant && (
            <>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() =>
                  onShareFormOpen(lead.id, leadFullName, lead.sharedUser!)
                }
              >
                <Share size={16} />
                Share Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onTransferFormOpen(lead.id, leadFullName)}
              >
                <Reply size={16} />
                Transfer Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onIntakeFormOpen(lead.id, leadFullName)}
              >
                <BookText size={16} />
                Intake Form
              </DropdownMenuItem>
            </>
          )}
          {conversation?.id && (
            <>
              <DropdownMenuItem
                className={cn(
                  " text-background cursor-pointer gap-2",
                  autoChat ? "bg-primary" : "bg-destructive"
                )}
                onClick={onTitanToggle}
              >
                <div className="flex items-center justify-between gap-2">
                  {autoChat ? <Check size={16} /> : <X size={16} />}
                  <span>Titan</span>
                  <span>{autoChat ? "ON" : "OFF"}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => setAlertOpen(true)}
              >
                <Trash size={16} />
                Delete Convo
              </DropdownMenuItem>
            </>
          )}

          {!isAssistant && (
            <>
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
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
