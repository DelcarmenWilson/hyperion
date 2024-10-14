"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useBeneficiaryStore,
  useLeadBeneficiaryActions,
  useLeadBeneficiaryData,
} from "@/hooks/lead/use-beneficiary";

import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { BeneficiaryForm } from "./form";
import { BeneficiariesList } from "./list";
import { columns } from "./columns";

type BeneficiariesClientProp = {
  size?: string;
};

export const BeneficiariesClient = ({
  size = "full",
}: BeneficiariesClientProp) => {
  const user = useCurrentUser();
  const { onBeneficiaryFormOpen } = useBeneficiaryStore();
  const { beneficiaries, isFetchingBeneficiaries } = useLeadBeneficiaryData();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingBeneficiaries}>
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
        <SkeletonWrapper isLoading={isFetchingBeneficiaries}>
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
          <SkeletonWrapper isLoading={isFetchingBeneficiaries}>
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
