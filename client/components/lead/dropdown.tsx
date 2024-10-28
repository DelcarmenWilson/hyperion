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
  useLeadStore,
  useLeadData,
  useLeadTitanActions,
} from "@/hooks/lead/use-lead";
import { useAppointmentStore } from "@/hooks/use-appointment";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";
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

import { exportLeads } from "@/lib/xlsx";

import { conversationDeleteById } from "@/actions/lead/conversation";
import { leadDefaultStatus } from "@/constants/lead";

type DropDownProps = {
  action?: boolean;
};

export const LeadDropDown = ({ action = false }: DropDownProps) => {
  const role = useCurrentRole();
  const { onFormOpen } = useAppointmentStore();
  const { onShareFormOpen, onTransferFormOpen, onIntakeFormOpen } =
    useLeadStore();
  const { leadBasic, lead } = useLeadData();
  const { onTitanUpdated } = useLeadTitanActions();

  const [titan, setTitan] = useState<boolean>(lead?.titan!);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const isAssistant = role == "ASSISTANT";

  if (!leadBasic) return null;
  const leadFullName = `${leadBasic.firstName} ${leadBasic.lastName}`;
  const conversation = leadBasic.conversations[0];

  const onTitanToggle = () => {
    setTitan((state) => !state);
    onTitanUpdated({ id: lead?.id!, titan: !titan });
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
    if (!lead) return;
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
            disabled={leadBasic.statusId == leadDefaultStatus["DoNotCall"]}
            className="cursor-pointer gap-2"
            onClick={() => onFormOpen()}
          >
            <Calendar size={16} />
            New Appointment
          </DropdownMenuItem>
          {!isAssistant && (
            <>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() =>
                  onShareFormOpen(
                    [leadBasic.id],
                    leadFullName,
                    lead?.sharedUser!
                  )
                }
              >
                <Share size={16} />
                Share Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onTransferFormOpen([leadBasic.id], leadFullName)}
              >
                <Reply size={16} />
                Transfer Lead
              </DropdownMenuItem>
              {/* srinitodo */}
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => {}}
              >
                <Trash size={16}  />
                Delete Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onIntakeFormOpen(leadBasic.id, leadFullName)}
              >
                <BookText size={16} />
                Intake Form
              </DropdownMenuItem>
            </>
          )}
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
          {conversation?.id && (
            <>
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
