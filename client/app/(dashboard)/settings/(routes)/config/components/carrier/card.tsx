"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";

import { FullUserCarrier } from "@/types";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { CarrierForm } from "./form";

import { userCarrierDeleteById } from "@/actions/user";
import { formatDate } from "@/formulas/dates";

export const CarrierCard = ({
  initCarrier,
}: {
  initCarrier: FullUserCarrier;
}) => {
  const [carrier, setCarrier] = useState(initCarrier);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteCarrier = () => {
    setLoading(true);
    userCarrierDeleteById(carrier.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        userEmitter.emit("carrierDeleted", carrier.id);
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setCarrier(initCarrier);
    const onCarrierUpdated = (e: FullUserCarrier) => {
      if (e.id == carrier.id) setCarrier(e);
    };
    userEmitter.on("carrierUpdated", (info) => onCarrierUpdated(info));
  }, [initCarrier]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteCarrier}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Carrier"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CarrierForm carrier={carrier} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${carrier.carrier.name}`}</h3>

        <CardData label="agent Id" value={carrier.agentId} />
        <CardData label="Date Created" value={formatDate(carrier.createdAt)} />
        <CardData label="Date Updated" value={formatDate(carrier.updatedAt)} />

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
