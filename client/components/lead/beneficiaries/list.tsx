"use client";
import { cn } from "@/lib/utils";
import { BeneficiaryCard } from "./card";
import { LeadBeneficiary } from "@prisma/client";

type BeneficiariesListProps = {
  beneficiaries: LeadBeneficiary[];
  size?: string;
};
export const BeneficiariesList = ({
  beneficiaries,
  size = "full",
}: BeneficiariesListProps) => {
  return (
    <>
      {beneficiaries.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {beneficiaries.map((beneficiary) => (
            <BeneficiaryCard key={beneficiary.id} beneficiary={beneficiary} />
          ))}
        </div>
      ) : (
        <div>
          <p className="font-semibold text-center">No Beneficiaries Found</p>
        </div>
      )}
    </>
  );
};
