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

import { useAppointmentModal } from "@/hooks/use-appointment-modal";

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
import { ShareForm } from "./forms/share-form";

type DropDownProps = {
  lead: FullLeadNoConvo;
  conversation?: Conversation;
};

export const LeadDropDown = ({ lead, conversation }: DropDownProps) => {
  const role = useCurrentRole();
  const useAppointment = useAppointmentModal();
  const [autoChat, setAutoChat] = useState<boolean>(conversation?.autoChat!);

  const [intakeDialogOpen, setIntakeDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const onTitanToggle = () => {
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
    setLoading(true);
    conversationDeleteById(conversation?.id as string).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });

    setLoading(false);
    setAlertOpen(false);
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
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        height="h-auto"
      />
      <Dialog open={intakeDialogOpen} onOpenChange={setIntakeDialogOpen}>
        <DialogContent className="flex flex-col justify-start h-full max-w-screen-lg">
          <h3 className="text-2xl font-semibold py-2">
            Intake Form -{" "}
            <span className="text-primary">{`${lead.firstName} ${lead.lastName}`}</span>
          </h3>
          <IntakeForm leadId={lead.id} />
        </DialogContent>
      </Dialog>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="flex flex-col justify-start h-auto max-w-screen-sm">
          <h3 className="text-2xl font-semibold py-2">
            Share Lead -{" "}
            <span className="text-primary">{`${lead.firstName} ${lead.lastName}`}</span>
          </h3>
          <ShareForm
            leadId={lead.id}
            sharedUser={lead.sharedUser}
            onClose={() => setShareDialogOpen(false)}
          />
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
            onClick={() => setShareDialogOpen(true)}
          >
            <Share size={16} />
            Share Lead
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => setIntakeDialogOpen(true)}
          >
            <BookText size={16} />
            Intake Form
          </DropdownMenuItem>
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
