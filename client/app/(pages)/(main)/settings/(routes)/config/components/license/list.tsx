"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useImageViewer } from "@/hooks/use-image-viewer";
import {
  useAgentLicenseActions,
  useAgentLicenseData,
} from "../../hooks/use-license";

import { UserLicense } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardData } from "@/components/reusable/card-data";
import DeleteDialog from "@/components/custom/delete-dialog";
import { EmptyData } from "@/components/lead/info/empty-data";
import LicenseDrawer from "./drawer";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";

const LicenseList = ({ size = "full" }: { size?: string }) => {
  const { onGetLicences } = useAgentLicenseData();
  const { licenses, licensesFetching } = onGetLicences();
  return (
    <SkeletonWrapper isLoading={licensesFetching}>
      {licenses?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      ) : (
        <div>
          <EmptyData title="No Licenses Found" />
        </div>
      )}
    </SkeletonWrapper>
  );
};

const LicenseCard = ({ license }: { license: UserLicense }) => {
  const { onDeleteLicense, licenseDeleting } = useAgentLicenseActions();
  const { onOpen } = useImageViewer();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LicenseDrawer
        license={license}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <Card className="flex flex-col hover:bg-accent">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-semibold text-center">
            {`${license.state} - ${license.licenseNumber}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 overflow-hidden text-sm">
          {license.image && (
            <div className="flex-center border rounded-xl p-2 overflow-hidden text-sm gap-2">
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
        </CardContent>
        <CardFooter className="flex group gap-2 justify-end items-center mt-auto">
          <DeleteDialog
            title="Are your sure you want to delete this carrier?"
            btnClass="opacity-0 group-hover:opacity-100 w-fit"
            cfText={license.licenseNumber}
            onConfirm={() => onDeleteLicense(license.id)}
            loading={licenseDeleting}
          />
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LicenseList;
