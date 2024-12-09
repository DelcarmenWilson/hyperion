"use client";

import { Edit, RefreshCw, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  useBeneficiaryStore,
  useLeadBeneficiaryActions,
} from "@/hooks/lead/use-beneficiary";

import { LeadBeneficiary } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BeneficiaryForm } from "./form";
import DeleteDialog from "@/components/custom/delete-dialog";
import { CardData } from "@/components/reusable/card-data";
import Hint from "@/components/custom/hint";

import { formatDob, getAge } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

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

export const BeneficiaryCard = ({
  beneficiary,
}: {
  beneficiary: LeadBeneficiary;
}) => {
  const { onBeneficiaryFormOpen } = useBeneficiaryStore();
  const {
    onDeleteBeneficiary,
    beneficiaryDeleting,
    onConvertBeneficiary,
    beneficiaryConverting,
  } = useLeadBeneficiaryActions();
  const fullName = `${beneficiary.firstName} ${beneficiary.lastName}`;

  return (
    <>
      <BeneficiaryForm />
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <div className="text-2xl text-primary font-semibold text-center">
          {beneficiary.convertedLeadId ? (
            <Hint label="View lead details" side="top">
              <Link
                className="hover:underline hover:text-primary/75"
                href={`/leads/${beneficiary.convertedLeadId}`}
              >
                {fullName}
              </Link>
            </Hint>
          ) : (
            <h3>{fullName}</h3>
          )}
        </div>

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
        <div className="flex justify-between items-center">
          <CardData label="Share" value={beneficiary.share} />
          {beneficiary.convertedLeadId && <Badge>Lead</Badge>}
        </div>

        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Hint label="Delete Beneficiary" side="top">
            <DeleteDialog
              title="beneficiary"
              cfText="delete"
              onConfirm={() => onDeleteBeneficiary(beneficiary.id)}
              loading={beneficiaryDeleting}
            />
          </Hint>
          {!beneficiary.convertedLeadId && (
            <Hint label="Convert to lead" side="top">
              <Button
                size="icon"
                variant="gradientDark"
                disabled={beneficiaryConverting}
                onClick={() => onConvertBeneficiary(beneficiary.id)}
              >
                <RefreshCw size={15} />
              </Button>
            </Hint>
          )}
          <Hint label="Edit Beneficiary" side="top">
            <Button
              size="icon"
              onClick={() => onBeneficiaryFormOpen(beneficiary.id)}
            >
              <Edit size={15} />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
