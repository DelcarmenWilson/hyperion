"use client";
import { LeadBeneficiary } from "@prisma/client";
import { BeneficiaryCard } from "./card";

type BeneficiariesListProps = {
  beneficiaries: LeadBeneficiary[];
};
export const BeneficiariesList = ({
  beneficiaries,
}: BeneficiariesListProps) => {
  return (
    <>
      {beneficiaries.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {beneficiaries.map((beneficiary) => (
            <BeneficiaryCard
              key={beneficiary.id}
              initBeneficiary={beneficiary}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Benefieries Found</p>
        </div>
      )}
    </>
  );
};
