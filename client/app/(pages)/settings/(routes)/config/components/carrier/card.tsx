"use client";
import { useState } from "react";

import { useAgentCarrierActions } from "../../hooks/use-carrier";

import { FullUserCarrier } from "@/types";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { CarrierForm } from "./form";

import { formatDate } from "@/formulas/dates";

export const CarrierCard = ({ carrier }: { carrier: FullUserCarrier }) => {
  const { alertOpen, setAlertOpen, onCarrierDelete, isPendingCarrierDelete } =
    useAgentCarrierActions();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onCarrierDelete(carrier.id)}
        loading={isPendingCarrierDelete}
        height="auto"
      />
      {/* //TODO need to extract the form into its own file and add a store */}
      <DrawerRight
        title="Edit Carrier"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CarrierForm carrier={carrier} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${carrier.carrier.name}`}</h3>

        <CardData label="Agent Id" value={carrier.agentId} />
        <CardData label="Commision Rate" value={`${carrier.rate}%`} />
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
