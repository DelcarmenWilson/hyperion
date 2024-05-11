"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { LeadStatus } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { LeadStatusForm } from "./form";
import { userLeadStatusDeleteById } from "@/actions/user";

type LeadStatusCardProps = {
  initLeadStatus: LeadStatus;
};
export const LeadStatusCard = ({ initLeadStatus }: LeadStatusCardProps) => {
  const [leadStatus, setLeadStatus] = useState(initLeadStatus);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteLeadStatus = () => {
    setLoading(true);

    userLeadStatusDeleteById(leadStatus.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        userEmitter.emit("userLeadStatusDeleted", leadStatus.id);
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setLeadStatus(initLeadStatus);
    const onLeadStatusUpdated = (e: LeadStatus) => {
      if (e.id == leadStatus.id) setLeadStatus(e);
    };
    userEmitter.on("userLeadStatusUpdated", (info) =>
      onLeadStatusUpdated(info)
    );
  }, [initLeadStatus]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteLeadStatus}
        loading={loading}
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
        <CardData title="Type" value={leadStatus.type} />
        <CardData
          title="Description"
          value={leadStatus.description as string}
        />
        <CardData
          title="Date Created"
          value={format(leadStatus.createdAt, "MM-dd-yyy")}
        />
        <CardData
          title="Date Updated"
          value={format(leadStatus.updatedAt, "MM-dd-yyy")}
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
