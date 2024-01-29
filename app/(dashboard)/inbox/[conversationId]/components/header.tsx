"use client";
import { useState } from "react";
import axios from "axios";

import { FullConversationType } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Phone, Trash } from "lucide-react";
import { formatPhoneNumber } from "@/formulas/phones";
import { useDialerModal } from "@/hooks/use-dialer-modal";
import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";

interface HeaderProps {
  conversation: FullConversationType;
}
export const Header = ({ conversation }: HeaderProps) => {
  const router = useRouter();
  const useDialer = useDialerModal();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  //   const [drawerOpen, setDrawerOpen] = useState(false);
  const lead = conversation.lead;
  const initials = `${lead.firstName.substring(0, 1)} ${lead.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${lead.firstName} ${lead.lastName}`;
  const formattedLead: LeadColumn = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    autoChat: lead.autoChat,
    notes: lead.notes!,
    createdAt: lead.createdAt,
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/conversations/${conversation.id}`);
      router.refresh();
      router.push("/inbox");
      toast.success("Conversation deleted.");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setAlertOpen(true);
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

      <div className="flex flex-1 justify-between items-center h-14 px-2">
        <div className="flex justify-center items-center bg-primary text-accent rounded-full p-1 mr-2">
          <span className="text-lg font-semibold">{initials}</span>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <span className="text-lg">
            {fullName} {formatPhoneNumber(conversation.lead.cellPhone)}
          </span>
          <Button
            className="rounded-full"
            variant="outlineprimary"
            size="icon"
            onClick={() => useDialer.onOpen(formattedLead)}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outlineprimary"
            size="sm"
            onClick={() => router.push("/inbox")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            GO BACK
          </Button>
          <Button variant="destructive" onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};
