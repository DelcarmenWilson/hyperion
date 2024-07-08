"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";

import { LeadBeneficiary } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { BeneficiaryForm } from "./form";
import { BeneficiariesList } from "./list";
import { columns } from "./columns";
import { leadBeneficiariesGetAllById } from "@/actions/lead/beneficiary";

type BeneficiariesClientProp = {
  leadId: string;
  size?: string;
};

export const BeneficiariesClient = ({
  leadId,
  size = "full",
}: BeneficiariesClientProp) => {
  const user = useCurrentUser();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="Add Beneficiary"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={setIsDrawerOpen}
      size={size}
    />
  );

  const beneficiariesQuery = useQuery<LeadBeneficiary[]>({
    queryKey: ["leadBeneficiaries", `lead-${leadId}`],
    queryFn: () => leadBeneficiariesGetAllById(leadId),
  });

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
        <SkeletonWrapper isLoading={beneficiariesQuery.isFetching}>
          <DataTable
            columns={columns}
            data={beneficiariesQuery.data || []}
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
          <SkeletonWrapper isLoading={beneficiariesQuery.isFetching}>
            <BeneficiariesList
              beneficiaries={beneficiariesQuery.data || []}
              size={size}
            />
          </SkeletonWrapper>
        </>
      )}
    </>
  );
};
