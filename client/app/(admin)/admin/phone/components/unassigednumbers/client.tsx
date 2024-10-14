"use client";
import { PhoneMissedIcon } from "lucide-react";
import { usePhoneSetupData } from "@/hooks/use-phone-setup";

import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { columns } from "./columns";

export const UnassignedNumbersClient = () => {
  const { unasignedNumbers, isFetchingUnasignedNumbers } = usePhoneSetupData();
  if (!unasignedNumbers?.length) return null;
  return (
    <CardLayout title="Unassigned Numbers" icon={PhoneMissedIcon}>
      <SkeletonWrapper isLoading={isFetchingUnasignedNumbers}>
        <DataTable data={unasignedNumbers || []} columns={columns} headers />
      </SkeletonWrapper>
    </CardLayout>
  );
};
