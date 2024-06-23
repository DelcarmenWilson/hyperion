"use client";
import Link from "next/link";
import { Lead } from "@prisma/client";

import { formatPhoneNumber } from "@/formulas/phones";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import axios from "axios";
import { usePhone } from "@/hooks/use-phone";

export const CellDetails = ({ lead }: { lead: Lead }) => {
  const { onPhoneOutOpen } = usePhone();
  const onCall = async () => {
    //TO DO THIS IS ALL TEMPORARY UNTIL WE FIND A MORE PERMANENT SOLUTION
    const response = await axios.post("/api/leads/details/by-id", {
      leadId: lead?.id,
    });
    const lid = response.data;
    onPhoneOutOpen(lid);
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
