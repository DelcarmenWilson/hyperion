"use client";
import { ClipboardList } from "lucide-react";
import { usePhoneSetupData } from "@/hooks/use-phone-setup";

import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { columns } from "./columns";

export const AgentNumbersClient = () => {
  const { phoneNumbers, isFetchingPhoneNumbers } = usePhoneSetupData();
  return (
    <CardLayout title="Agent Numbers" icon={ClipboardList}>
      <SkeletonWrapper isLoading={isFetchingPhoneNumbers}>
        <DataTable data={phoneNumbers || []} columns={columns} headers />
      </SkeletonWrapper>
    </CardLayout>
  );
};
