"use client";
import { useState } from "react";
import { toast } from "sonner";
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

import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/user-current-role";

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

import { useAppointmentStore } from "@/hooks/use-appointment";

import { AlertModal } from "@/components/modals/alert";
import { FullLeadNoConvo } from "@/types";
import { LeadConversation } from "@prisma/client";
import { exportLeads } from "@/lib/xlsx";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { conversationDeleteById } from "@/actions/lead/conversation";
import { leadUpdateByIdAutoChat } from "@/actions/lead";
import { leadDefaultStatus } from "@/constants/lead";

type DropDownProps = {
  lead: FullLeadNoConvo;
  conversation?: LeadConversation;
  action?: boolean;
};

export const LeadDropDown = ({
  lead,
  conversation,
  action = false,
}: DropDownProps) => {
  const role = useCurrentRole();
  const { setLeadId } = useLeadStore();
  const { onFormOpen } = useAppointmentStore();
  const { onShareFormOpen, onTransferFormOpen, onIntakeFormOpen } =
    useLeadStore();
  const [titan, setTitan] = useState<boolean>(lead.titan);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const isAssistant = role == "ASSISTANT";
  const leadFullName = `${lead.firstName} ${lead.lastName}`;

  const onTitanToggle = async () => {
    setTitan((state) => !state);
    const updateTitan = await leadUpdateByIdAutoChat(lead.id, !titan);
    if (updateTitan.success) toast.success(updateTitan.success);
    else toast.error(updateTitan.error);
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
          {action ? (
            <Button className="gap-2" size="sm">
              Actions
              <ChevronDown size={16} />
            </Button>
          ) : (
            <Button className="rounded-full" size="icon">
              <ChevronDown size={16} />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            disabled={lead.statusId == leadDefaultStatus["DoNotCall"]}
            className="cursor-pointer gap-2"
            onClick={() => {
              setLeadId(lead.id);
              onFormOpen();
            }}
          >
            <Calendar size={16} />
            New Appointment
          </DropdownMenuItem>
          {!isAssistant && (
            <>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() =>
                  onShareFormOpen([lead.id], leadFullName, lead.sharedUser!)
                }
              >
                <Share size={16} />
                Share Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onTransferFormOpen([lead.id], leadFullName)}
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
                  titan ? "bg-primary" : "bg-destructive"
                )}
                onClick={onTitanToggle}
              >
                <div className="flex items-center justify-between gap-2">
                  {titan ? <Check size={16} /> : <X size={16} />}
                  <span>Titan</span>
                  <span>{titan ? "ON" : "OFF"}</span>
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
