"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";

import { usePhone } from "@/hooks/use-phone";

import { FullConversation } from "@/types";
import { Button } from "@/components/ui/button";

import { formatPhoneNumber } from "@/formulas/phones";
import { DropDown } from "@/components/lead/dropdown";

interface HeaderProps {
  conversation: FullConversation;
}
export const Header = ({ conversation }: HeaderProps) => {
  const router = useRouter();
  const usePm = usePhone();

  const lead = conversation.lead;
  const initials = `${lead.firstName.substring(0, 1)} ${lead.lastName.substring(
    0,
    1
  )}`;
  const fullName = `${lead.firstName} ${lead.lastName}`;

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
          disabled={lead.status == "Do_Not_Call"}
          className="rounded-full"
          variant="outlineprimary"
          size="icon"
          onClick={() => usePm.onPhoneOutOpen(lead)}
        >
          <Phone className="w-4 h-4" />
        </Button>

        <DropDown lead={lead} />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outlineprimary"
          size="sm"
          onClick={() => router.push("/inbox")}
        >
          <ArrowLeft size={16} className="mr-2" />
          GO BACK
        </Button>
      </div>
    </div>
  );
};
