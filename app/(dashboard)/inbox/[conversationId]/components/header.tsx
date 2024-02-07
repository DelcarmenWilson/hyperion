"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";

import { usePhoneModal } from "@/hooks/use-phone-modal";

import { FullConversationType, FullLead } from "@/types";
import { Button } from "@/components/ui/button";
import { DropDown } from "@/app/(dashboard)/leads/components/shared/dropdown";

import { formatPhoneNumber } from "@/formulas/phones";

interface HeaderProps {
  conversation: FullConversationType;
}
export const Header = ({ conversation }: HeaderProps) => {
  const router = useRouter();
  const usePm = usePhoneModal();

  const lead = conversation.lead;
  const initials = `${lead.firstName.substring(0, 1)} ${lead.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${lead.firstName} ${lead.lastName}`;
  const formattedLead: FullLead = {
    id: lead.id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    cellPhone: lead.cellPhone,
    defaultNumber: lead.defaultNumber,
    autoChat: conversation.autoChat,
    notes: lead.notes!,
    createdAt: lead.createdAt,
  };

  return (
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
          onClick={() => usePm.onDialerOpen(formattedLead)}
        >
          <Phone className="w-4 h-4" />
        </Button>

        <DropDown lead={formattedLead} />
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
      </div>
    </div>
  );
};
