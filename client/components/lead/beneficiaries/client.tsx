"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useBeneficiaryStore } from "@/stores/beneficiary-store";
import { useLeadBeneficiaryData } from "@/hooks/lead/use-beneficiary";

import { columns } from "./columns";
import { BeneficiaryForm } from "./form";
import { BeneficiariesList } from "./list";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";

type BeneficiariesClientProp = {
  leadId: string;
  size?: string;
};

export const BeneficiariesClient = ({
  leadId,
  size = "full",
}: BeneficiariesClientProp) => {
  const user = useCurrentUser();
  const { onBeneficiaryFormOpen } = useBeneficiaryStore();
  const { onGetLeadBeneficiaries } = useLeadBeneficiaryData(leadId);
  const { beneficiaries, beneficiariesFetching } = onGetLeadBeneficiaries();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={beneficiariesFetching}>
      <ListGridTopMenu
        text="Add Beneficiary"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={onBeneficiaryFormOpen}
        size={size}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <BeneficiaryForm />

      {isList ? (
        <SkeletonWrapper isLoading={beneficiariesFetching}>
          <DataTable
            columns={columns}
            data={beneficiaries || []}
            headers
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div
            className={cn(
              "flex justify-between items-center p-1",
              size == "sm" && "flex-col text-center"
            )}
          >
            <h4 className="text-2xl font-semibold">Beneficiaries</h4>
            {topMenu}
          </div>
          <SkeletonWrapper isLoading={beneficiariesFetching}>
            <BeneficiariesList
              beneficiaries={beneficiaries || []}
              size={size}
            />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
