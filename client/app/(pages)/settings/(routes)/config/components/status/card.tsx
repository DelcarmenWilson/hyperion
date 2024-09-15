"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { LeadStatus } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { LeadStatusForm } from "./form";
import { userLeadStatusDeleteById } from "@/actions/user/lead-status";
import { formatDate } from "@/formulas/dates";
import { useAgentLeadStatusActions } from "../../hooks/use-lead-status";

export const LeadStatusCard = ({ leadStatus }: { leadStatus: LeadStatus }) => {
  const {
    alertOpen,
    setAlertOpen,
    onLeadStatusDelete,
    isPendingLeadStatusDelete,
  } = useAgentLeadStatusActions();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onLeadStatusDelete(leadStatus.id)}
        loading={isPendingLeadStatusDelete}
        height="auto"
      />
      <DrawerRight
        title="Edit LeadStatus"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <LeadStatusForm
          leadStatus={leadStatus}
          onClose={() => setIsOpen(false)}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {leadStatus.status}
        </h3>
        <CardData label="Type" value={leadStatus.type} />
        <CardData
          label="Description"
          value={leadStatus.description as string}
        />
        <CardData
          label="Date Created"
          value={formatDate(leadStatus.createdAt)}
        />
        <CardData
          label="Date Updated"
          value={formatDate(leadStatus.updatedAt)}
        />
        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
