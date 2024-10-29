"use client";
import { Phone } from "lucide-react";
import { useCallHistoryData } from "./hooks/use-call-history";

import { columns } from "./columns";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./top-menu";

type CallHistoryClientProps = {
  userId?: string;
  duration?: number;
  showLink?: boolean;
  showDate?: boolean;
};

export const CallHistoryClient = ({
  userId,
  duration = 0,
  showLink = false,
  showDate = false,
}: CallHistoryClientProps) => {
  const { calls, callsLoading, onDateSelected } = useCallHistoryData(
    userId,
    showDate
  );
  return (
    <CardLayout
      title="Call History"
      icon={Phone}
      topMenu={
        <TopMenu
          showLink={showLink}
          showDate={showDate}
          duration={duration}
          onDateSelected={onDateSelected}
        />
      }
    >
      <SkeletonWrapper isLoading={callsLoading}>
        <DataTable
          columns={columns}
          data={calls || []}
          headers
          striped
          paginationType="advance"
          filterType="call"
          hidden={{ direction: false, status: false }}
        />
      </SkeletonWrapper>
    </CardLayout>
  );
};
