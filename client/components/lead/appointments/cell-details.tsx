"use client";
import Link from "next/link";
import { Phone } from "lucide-react";
import { usePhoneStore } from "@/stores/phone-store";
import { useLeadStore } from "@/stores/lead-store";

import { Lead } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/formulas/phones";

export const CellDetails = ({ lead }: { lead: Lead }) => {
  const { onPhoneOutOpen } = usePhoneStore();
  const { setLeadId, setConversationId } = useLeadStore();
  const onCall = async () => {
    setLeadId(lead.id);
    onPhoneOutOpen();
  };
  return (
    <div>
      <p className="capitalize font-bold">
        {lead.firstName} {lead.lastName}
      </p>

      <div className="flex items-center gap-2">
        <Link
          className="text-primary font-bold opacity-80 hover:underline italic"
          href={`/leads/${lead.id}`}
        >
          {formatPhoneNumber(lead.cellPhone)}
        </Link>
        <Button size="xs" onClick={onCall}>
          <Phone size={14} />
        </Button>
      </div>
      <p className="lowercase">{lead.email}</p>
    </div>
  );
};
