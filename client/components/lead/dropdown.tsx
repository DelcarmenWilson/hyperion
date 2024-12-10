"use client";
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

import { useAppointmentStore } from "@/stores/appointment-store";
import { useLeadStore } from "@/stores/lead-store";
import { useLeadDropdownActions } from "@/hooks/lead/use-dropdown";

import { FullLeadNoConvo } from "@/types";
import { LeadDefaultStatus } from "@/types/lead";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";
import DeleteDialog from "../custom/delete-dialog";
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

type DropDownProps = {
  lead: FullLeadNoConvo;
  conversationId?: string;
  action?: boolean;
};

export const LeadDropDown = ({
  lead,
  conversationId,
  action = false,
}: DropDownProps) => {
  const { onAppointmentFormOpen } = useAppointmentStore();
  const { onShareFormOpen, onTransferFormOpen, onIntakeFormOpen, setLeadId } =
    useLeadStore();
  const {
    titan,
    isAssistant,
    alertDeleteConvoOpen,
    setAlertDeleteConvoOpen,
    onConversationDelete,
    conversationDeleting,
    onLeadDelete,
    leadDeleting,
    onTitanUpdated,
    titanUpdating,
    onPreExport,
  } = useLeadDropdownActions(lead);
  const leadFullName = `${lead.firstName} ${lead.lastName}`;

  return (
    <>
      <AlertModal
        isOpen={alertDeleteConvoOpen}
        onClose={() => setAlertDeleteConvoOpen(false)}
        onConfirm={() => onConversationDelete(conversationId as string)}
        loading={conversationDeleting}
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
            disabled={lead.statusId == LeadDefaultStatus.DONOTCALL}
            className="cursor-pointer gap-2"
            onClick={() => {
              setLeadId(lead.id);
              onAppointmentFormOpen();
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
                  onShareFormOpen([lead.id], leadFullName, lead?.sharedUser!)
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
          <DropdownMenuItem
            className={cn(
              "cursor-pointer gap-2 ",
              titan && "bg-primary text-background"
            )}
            disabled={titanUpdating}
            onClick={onTitanUpdated}
          >
            <div className="flex items-center justify-between gap-2">
              {titan ? <Check size={16} /> : <X size={16} />}
              <span>Titan</span>
              <span>{titan ? "ON" : "OFF"}</span>
            </div>
          </DropdownMenuItem>

          {!isAssistant && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => onPreExport("Excel")}
                    >
                      <FileBarChart size={16} />
                      Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => onPreExport("Pdf")}
                    >
                      <FileText size={16} />
                      Pdf
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="bg-red-500 focus:bg-red-500 data-[state=open]:bg-red-500 text-white">
              Danger Zone
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer gap-2" asChild>
                  <DeleteDialog
                    triggerText="Delete Lead"
                    title="lead"
                    cfText={lead.textCode}
                    onConfirm={onLeadDelete}
                    loading={leadDeleting}
                  />
                </DropdownMenuItem>
                {conversationId && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => setAlertDeleteConvoOpen(true)}
                    >
                      <Trash size={16} />
                      Delete Convo
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
