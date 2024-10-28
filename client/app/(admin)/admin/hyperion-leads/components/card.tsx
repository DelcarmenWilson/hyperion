"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";

import { HyperionLead } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import { CardData } from "@/components/reusable/card-data";

import { HyperionLeadForm } from "./form";
import { formatDate } from "@/formulas/dates";

type HyperionLeadCardProps = {
  initLead: HyperionLead;
};
export const HyperionLeadCard = ({ initLead }: HyperionLeadCardProps) => {
  const [lead, setLead] = useState(initLead);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLead(initLead);
    const onHyperionLeadUpdated = (e: HyperionLead) => {
      if (e.id == lead.id) setLead(e);
    };
    adminEmitter.on("hyperionLeadUpdated", (info) =>
      onHyperionLeadUpdated(info)
    );
    return () => {
      adminEmitter.on("hyperionLeadUpdated", (info) =>
        onHyperionLeadUpdated(info)
      );
    };
  }, [initLead]);
  return (
    <>
      <DrawerRight
        title="Edit HyperionLead"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <HyperionLeadForm lead={lead} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${lead.firstName} ${lead.lastName}`}</h3>

        {lead.address && (
          <address>
            <p>{lead.address}</p>
            <p>{`${lead.city}, ${lead.state}`}</p>
          </address>
        )}
        <CardData label="cellPhone" value={lead.cellPhone} />
        <CardData label="dateOfBirth" value={lead.dateOfBirth} />
        <CardData label="gender" value={lead.gender} />
        <CardData label="maritalStatus" value={lead.maritalStatus} />
        <CardData label="height" value={lead.height} />
        <CardData label="policyAmount" value={lead.policyAmount} />
        <CardData label="smoker" value={lead.smoker} />
        <CardData label="Date Created" value={formatDate(lead.createdAt)} />
        <CardData label="Date Updated" value={formatDate(lead.updatedAt)} />

        <Button onClick={() => setIsOpen(true)}>Edit</Button>
      </div>
    </>
  );
};
