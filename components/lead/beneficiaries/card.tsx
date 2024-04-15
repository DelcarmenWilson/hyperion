"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LeadBeneficiary } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { BeneficiaryForm } from "./form";

import { leadBeneficiaryDeleteById } from "@/actions/lead";
import { toast } from "sonner";
import { format } from "date-fns";
import { getAge } from "@/formulas/dates";
import { AlertModal } from "@/components/modals/alert";

type BeneficiaryCardProps = {
  initBeneficiary: LeadBeneficiary;
  onBeneficiaryDeleted: (e: string) => void;
};
export const BeneficiaryCard = ({
  initBeneficiary,
  onBeneficiaryDeleted,
}: BeneficiaryCardProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [beneficiary, setBeneficiary] = useState(initBeneficiary);

  const onBeneficiaryUpdated = (e: LeadBeneficiary) => {
    setBeneficiary(e);
  };

  const onDeleteBenficiary = () => {
    leadBeneficiaryDeleteById(beneficiary.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        onBeneficiaryDeleted(beneficiary.id);
        toast.success(data.success);
      }
    });
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteBenficiary}
        loading={loading}
      />
      <DrawerRight
        title="Edit Beneficiary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <BeneficiaryForm
          beneficiary={beneficiary}
          onClose={() => setIsOpen(false)}
          onBeneficiaryChange={onBeneficiaryUpdated}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${beneficiary.firstName} ${beneficiary.lastName}`}</h3>
        <DataCard title="Type" value={beneficiary.type} />

        <DataCard title="First Name" value={beneficiary.firstName} />
        <DataCard title="Last Name" value={beneficiary.lastName} />

        <DataCard
          title="Address"
          value={`${beneficiary.address} ${beneficiary.city} ${beneficiary.state} ${beneficiary.zipCode}`}
        />
        <DataCard title="Phone" value={beneficiary.cellPhone as string} />
        <DataCard title="Gender" value={beneficiary.gender} />

        <DataCard title="Email" value={beneficiary.email as string} />
        <div className="flex justify-between items-center">
          <DataCard
            title="Dob"
            value={
              beneficiary.dateOfBirth
                ? format(beneficiary.dateOfBirth, "MM-dd-yy")
                : ""
            }
          />
          <DataCard
            title="Age"
            value={
              beneficiary.dateOfBirth
                ? getAge(beneficiary.dateOfBirth).toString()
                : ""
            }
          />
        </div>
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

type DataCardProps = {
  title: string;
  value: string;
};

export const DataCard = ({ title, value }: DataCardProps) => {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <p className="font-semibold">{title}:</p>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
};
