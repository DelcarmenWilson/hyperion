"use client";
import { useState } from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { LeadBeneficiary } from "@prisma/client";
import { BeneficiaryForm } from "./form";
import { Button } from "@/components/ui/button";
import { BeneficiaryCard } from "./card";

type BeneficiariesClientProp = {
  leadId: string;
  initBeneficiaries: LeadBeneficiary[];
};

export const BeneficiariesClient = ({
  leadId,
  initBeneficiaries,
}: BeneficiariesClientProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] =
    useState<LeadBeneficiary[]>(initBeneficiaries);

  const onBeneficiaryInserted = (e: LeadBeneficiary) => {
    setBeneficiaries((beneficiaries) => [...beneficiaries, e]);
    setIsOpen(false);
  };

  const onBeneficiaryDeleted = (id: string) => {
    setBeneficiaries((beneficiaries) =>
      beneficiaries.filter((e) => e.id !== id)
    );
  };

  return (
    <>
      <DrawerRight
        title="New Beneficiary"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <BeneficiaryForm
          leadId={leadId}
          onClose={() => setIsOpen(false)}
          onBeneficiaryChange={onBeneficiaryInserted}
        />
      </DrawerRight>
      <div>
        <div className="flex justify-between items-center border-b p-2 mb-2">
          <p className=" text-2xl font-semibold">Beneficiaries</p>
          <Button onClick={() => setIsOpen(true)}>Add Beneficiary</Button>
        </div>
        {beneficiaries.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {beneficiaries.map((beneficiary) => (
              <BeneficiaryCard
                key={beneficiary.id}
                initBeneficiary={beneficiary}
                onBeneficiaryDeleted={onBeneficiaryDeleted}
              />
            ))}
          </div>
        ) : (
          <div>
            <p className="font-semibold text-center">No Benefieries Found</p>
          </div>
        )}
      </div>
    </>
  );
};
