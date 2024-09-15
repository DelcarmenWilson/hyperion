"use client";
import { useState } from "react";
import Image from "next/image";

import { useImageViewer } from "@/hooks/use-image-viewer";
import { useAgentLicenseActions } from "../../hooks/use-license";

import { UserLicense } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { LicenseForm } from "./form";

import { formatDate } from "@/formulas/dates";

type LicenseCardProps = {
  license: UserLicense;
};
export const LicenseCard = ({ license }: LicenseCardProps) => {
  const { alertOpen, setAlertOpen, onLicenseDelete, isPendingLicenseDelete } =
    useAgentLicenseActions();
  const { onOpen } = useImageViewer();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onLicenseDelete(license.id)}
        loading={isPendingLicenseDelete}
        height="auto"
      />
      <DrawerRight
        title="Edit License"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <LicenseForm license={license} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm gap-2">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${license.state} - ${license.licenseNumber}`}</h3>
        {license.image && (
          <div className="flex-center">
            <Image
              className="w-20 h-20 border cursor-pointer hover:border-primary"
              onClick={() => onOpen(license.image, license.state)}
              width={100}
              height={100}
              src={license.image}
              alt={license.state}
            />
          </div>
        )}

        <CardData label="State" value={license.state} />
        <CardData label="Type" value={license.type} />
        <CardData label="LicenseNumber" value={license.licenseNumber} />
        <CardData
          label="Date Expires"
          value={formatDate(license.dateExpires)}
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
