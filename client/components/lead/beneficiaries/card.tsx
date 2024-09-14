"use client";
import { useLeadBeneficiaryActions } from "@/hooks/lead/use-beneficiary";

import { Button } from "@/components/ui/button";
import { LeadBeneficiary } from "@prisma/client";

import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { BeneficiaryForm } from "./form";

import { formatDob, getAge } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

export const BeneficiaryCard = ({
  beneficiary,
}: {
  beneficiary: LeadBeneficiary;
}) => {
  const {
    alertOpen,
    setAlertOpen,
    onBeneficiaryFormOpen,
    onBeneficiaryDelete,
    isPendingBeneficiaryDelete,
  } = useLeadBeneficiaryActions();

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onBeneficiaryDelete(beneficiary.id)}
        loading={isPendingBeneficiaryDelete}
        height="auto"
      />
      <BeneficiaryForm />
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${beneficiary.firstName} ${beneficiary.lastName}`}</h3>
        <CardData label="Type" value={beneficiary.type} />
        <CardData label="Relationship" value={beneficiary.relationship} />

        <CardData label="First Name" value={beneficiary.firstName} />
        <CardData label="Last Name" value={beneficiary.lastName} />

        <CardData
          label="Address"
          value={`${beneficiary.address} ${beneficiary.city} ${beneficiary.state} ${beneficiary.zipCode}`}
        />
        <CardData
          label="Phone"
          value={formatPhoneNumber(beneficiary.cellPhone)}
        />
        <CardData label="Gender" value={beneficiary.gender} />

        <CardData label="Email" value={beneficiary.email} />
        <div className="flex justify-between items-center">
          <CardData label="Dob" value={formatDob(beneficiary.dateOfBirth)} />
          <CardData
            label="Age"
            value={
              beneficiary.dateOfBirth
                ? getAge(beneficiary.dateOfBirth).toString()
                : ""
            }
          />
        </div>
        <CardData label="Ssn#" value={beneficiary.ssn} />
        <CardData label="Share" value={beneficiary.share} />

        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={() => onBeneficiaryFormOpen(beneficiary.id)}>
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};
