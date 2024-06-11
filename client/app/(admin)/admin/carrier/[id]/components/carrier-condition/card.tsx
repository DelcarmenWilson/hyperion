"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { FullCarrierCondition } from "@/types";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { CarrierConditionForm } from "./form";

import { adminCarrierConditionDeleteById } from "@/actions/admin/carrier-condition";

type CarrierConditionCardProps = {
  initCarrierCondition: FullCarrierCondition;
};
export const CarrierConditionCard = ({
  initCarrierCondition,
}: CarrierConditionCardProps) => {
  const [carrierCondition, setCarrierCondition] =
    useState(initCarrierCondition);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeletecarrierCondition = async () => {
    setLoading(true);
    const deletedCarrier = await adminCarrierConditionDeleteById(
      carrierCondition.id
    );

    if (deletedCarrier.success) {
      userEmitter.emit("carrierConditionDeleted", carrierCondition.id);
      toast.success(deletedCarrier.success);
    } else toast.error(deletedCarrier.error);
    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setCarrierCondition(initCarrierCondition);
    const oncarrierConditionUpdated = (e: FullCarrierCondition) => {
      if (e.conditionId == carrierCondition.conditionId) setCarrierCondition(e);
    };
    userEmitter.on("carrierConditionUpdated", (info) =>
      oncarrierConditionUpdated(info)
    );
  }, [initCarrierCondition]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeletecarrierCondition}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit carrierCondition"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CarrierConditionForm
          carrierCondition={carrierCondition}
          onClose={() => setIsOpen(false)}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${carrierCondition.condition.name}`}</h3>

        <CardData label="Requirements" value={carrierCondition.requirements} />
        <CardData label="Notes" value={carrierCondition.notes} />
        <CardData
          label="Date Created"
          value={format(carrierCondition.createdAt, "MM-dd-yyyy")}
        />
        <CardData
          label="Date Updated"
          value={format(carrierCondition.updatedAt, "MM-dd-yyyy")}
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
