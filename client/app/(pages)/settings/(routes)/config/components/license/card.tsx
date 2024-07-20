"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { userEmitter } from "@/lib/event-emmiter";
import { toast } from "sonner";
import { useImageViewer } from "@/hooks/use-image-viewer";

import { UserLicense } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { LicenseForm } from "./form";

import { userLicenseDeleteById } from "@/actions/user";
import { formatDate } from "@/formulas/dates";

type LicenseCardProps = {
  initLicense: UserLicense;
};
export const LicenseCard = ({ initLicense }: LicenseCardProps) => {
  const { onOpen } = useImageViewer();
  const [license, setLicense] = useState(initLicense);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteLicense = async () => {
    setLoading(true);
    const deletedLicense = await userLicenseDeleteById(license.id);

    if (deletedLicense.success) {
      userEmitter.emit("licenseDeleted", license.id);
      toast.success(deletedLicense.success);
    } else toast.error(deletedLicense.error);

    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setLicense(initLicense);
    const onLicenseUpdated = (e: UserLicense) => {
      if (e.id == license.id) setLicense(e);
    };
    userEmitter.on("licenseUpdated", (info) => onLicenseUpdated(info));
  }, [initLicense]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteLicense}
        loading={loading}
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
