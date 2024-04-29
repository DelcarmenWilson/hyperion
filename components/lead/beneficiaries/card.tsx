"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LeadBeneficiary } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { BeneficiaryForm } from "./form";

import { getAge } from "@/formulas/dates";
import { leadBeneficiaryDeleteById } from "@/actions/lead";
import { formatPhoneNumber } from "@/formulas/phones";

type BeneficiaryCardProps = {
  initBeneficiary: LeadBeneficiary;
};
export const BeneficiaryCard = ({ initBeneficiary }: BeneficiaryCardProps) => {
  const [beneficiary, setBeneficiary] = useState(initBeneficiary);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteBenficiary = () => {
    setLoading(true);
    leadBeneficiaryDeleteById(beneficiary.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        userEmitter.emit("beneficiaryDeleted", beneficiary.id);
        toast.success(data.success);
      }
    });
    setAlertOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    setBeneficiary(initBeneficiary);
    const onBeneficiaryUpdated = (e: LeadBeneficiary) => {
      if (e.id == beneficiary.id) setBeneficiary(e);
    };
    userEmitter.on("beneficiaryUpdated", (info) => onBeneficiaryUpdated(info));
  }, [initBeneficiary]);
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteBenficiary}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Beneficiary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <BeneficiaryForm
          beneficiary={beneficiary}
          onClose={() => setIsOpen(false)}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${beneficiary.firstName} ${beneficiary.lastName}`}</h3>
        <CardData title="Type" value={beneficiary.type} />
        <CardData title="Relationship" value={beneficiary.relationship} />

        <CardData title="First Name" value={beneficiary.firstName} />
        <CardData title="Last Name" value={beneficiary.lastName} />

        <CardData
          title="Address"
          value={`${beneficiary.address} ${beneficiary.city} ${beneficiary.state} ${beneficiary.zipCode}`}
        />
        <CardData
          title="Phone"
          value={formatPhoneNumber(beneficiary.cellPhone)}
        />
        <CardData title="Gender" value={beneficiary.gender} />

        <CardData title="Email" value={beneficiary.email} />
        <div className="flex justify-between items-center">
          <CardData
            title="Dob"
            value={
              beneficiary.dateOfBirth
                ? format(beneficiary.dateOfBirth, "MM-dd-yy")
                : ""
            }
          />
          <CardData
            title="Age"
            value={
              beneficiary.dateOfBirth
                ? getAge(beneficiary.dateOfBirth).toString()
                : ""
            }
          />
        </div>
        <CardData title="Ssn#" value={beneficiary.ssn} />
        <CardData title="Share" value={beneficiary.share} />

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
