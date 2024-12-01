"use client";
import { Phone } from "lucide-react";
import { useCallHistoryData } from "./hooks/use-call-history";

import { columns } from "./columns";
import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./top-menu";
import { useState } from "react";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";

type CallHistoryClientProps = {
  userId?: string;
  showLink?: boolean;
  showDate?: boolean;
};

export const CallHistoryClient = ({
  userId,
  showLink = false,
  showDate = false,
}: CallHistoryClientProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const { calls, callsLoading } = useCallHistoryData(
    dateRange,
    userId,
    showDate
  );
  const duration = calls?.reduce((sum, call) => sum + call.duration!, 0) || 0;
  return (
    <CardLayout
      title="Call History"
      icon={Phone}
      topMenu={
        <TopMenu
          dateRange={dateRange}
          setDateRange={setDateRange}
          duration={duration}
          showLink={showLink}
          showDate={showDate}
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
