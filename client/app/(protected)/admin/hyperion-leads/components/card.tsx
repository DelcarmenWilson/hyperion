"use client";
import { useEffect, useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { HyperionLead } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { HyperionLeadForm } from "./form";

type HyperionLeadCardProps = {
  initLead: HyperionLead;
};
export const HyperionLeadCard = ({ initLead }: HyperionLeadCardProps) => {
  const [lead, setLead] = useState(initLead);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
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
        <CardData title="cellPhone" value={lead.cellPhone} />
        <CardData title="dateOfBirth" value={lead.dateOfBirth} />
        <CardData title="gender" value={lead.gender} />
        <CardData title="maritalStatus" value={lead.maritalStatus} />
        <CardData title="height" value={lead.height} />
        <CardData title="policyAmount" value={lead.policyAmount} />
        <CardData title="smoker" value={lead.smoker} />
        <CardData
          title="Date Created"
          value={format(lead.createdAt, "MM-dd-yyyy")}
        />
        <CardData
          title="Date Updated"
          value={format(lead.updatedAt, "MM-dd-yyyy")}
        />

        <Button onClick={() => setIsOpen(true)}>Edit</Button>
      </div>
    </>
  );
};
