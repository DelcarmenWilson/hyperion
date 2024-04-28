"use client";
import { useEffect, useState } from "react";
import { emitter } from "@/lib/event-emmiter";

import { cn } from "@/lib/utils";
import { LeadBeneficiary } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { BeneficiaryForm } from "./form";
import { BeneficiariesList } from "./list";
import { columns } from "./columns";

type BeneficiariesClientProp = {
  leadId: string;
  initBeneficiaries: LeadBeneficiary[];
  size?: string;
};

export const BeneficiariesClient = ({
  leadId,
  initBeneficiaries,
  size = "full",
}: BeneficiariesClientProp) => {
  const [beneficiaries, setBeneficiaries] =
    useState<LeadBeneficiary[]>(initBeneficiaries);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    setBeneficiaries(initBeneficiaries);
    const onBeneficiaryInserted = (newBeneficiary: LeadBeneficiary) => {
      const existing = beneficiaries.find((e) => e.id == newBeneficiary.id);
      if (existing == undefined)
        setBeneficiaries((beneficiaries) => [...beneficiaries, newBeneficiary]);
    };

    const onBeneficiaryDeleted = (id: string) => {
      setBeneficiaries((beneficiaries) =>
        beneficiaries.filter((e) => e.id !== id)
      );
    };
    emitter.on("beneficiaryInserted", (info) => onBeneficiaryInserted(info));
    emitter.on("beneficiaryDeleted", (id) => onBeneficiaryDeleted(id));
  }, [initBeneficiaries]);

  return (
    <>
      <DrawerRight
        title="New Beneficiary"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <BeneficiaryForm
          leadId={leadId}
          onClose={() => setIsDrawerOpen(false)}
        />
      </DrawerRight>
      {isList ? (
        <DataTable
          columns={columns}
          data={beneficiaries}
          headers
          topMenu={
            <ListGridTopMenu
              text="Add Beneficiary"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      ) : (
        <>
          <div
            className={cn(
              "flex justify-between items-center p-1",
              size == "sm" && "flex-col text-center"
            )}
          >
            <h4 className="text-2xl font-semibold">Beneficiaries</h4>
            <ListGridTopMenu
              text="Add Beneficiary"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
              size={size}
            />
          </div>
          <BeneficiariesList beneficiaries={beneficiaries} size={size} />
        </>
      )}
    </>
  );
};
