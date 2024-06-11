"use client";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { LeadBeneficiary } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { BeneficiaryForm } from "./form";

import { getAge } from "@/formulas/dates";
import { leadBeneficiaryDeleteById } from "@/actions/lead/beneficiary";
import { formatPhoneNumber } from "@/formulas/phones";

type BeneficiaryCardProps = {
  beneficiary: LeadBeneficiary;
};
export const BeneficiaryCard = ({ beneficiary }: BeneficiaryCardProps) => {
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: leadBeneficiaryDeleteById,
    onSuccess: () => {
      toast.success("Beneficiary Deleted", {
        id: "delete-beneficiary",
      });
      queryClient.invalidateQueries({
        queryKey: ["leadBeneficiaries", `lead-${beneficiary.leadId}`],
      });

      setAlertOpen(false);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => mutate(beneficiary.id)}
        loading={isPending}
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
          <CardData
            label="Dob"
            value={
              beneficiary.dateOfBirth
                ? format(beneficiary.dateOfBirth, "MM-dd-yy")
                : ""
            }
          />
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
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
