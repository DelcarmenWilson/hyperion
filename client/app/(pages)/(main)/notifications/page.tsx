"use client";
import { Bell } from "lucide-react";

import { useNotificationData } from "@/hooks/notification/use-notification";
import { columns } from "./_components/columns";

import { CardLayout } from "@/components/custom/card/layout";
import { DataTable } from "@/components/tables/data-table";

import SkeletonWrapper from "@/components/skeleton-wrapper";

import { useState } from "react";
import { startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { TopMenu } from "./_components/top-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const NotificationsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { onGetFilteredNotifications } = useNotificationData();
  const { notifications, notificationsFetching, notificationsLoading } =
    onGetFilteredNotifications(dateRange);

  return (
    <CardLayout
      title="Notifications"
      icon={Bell}
      topMenu={<TopMenu dateRange={dateRange} setDateRange={setDateRange} />}
    >
      <ScrollArea>
        <SkeletonWrapper isLoading={notificationsLoading}>
          <DataTable
            columns={columns}
            data={notifications || []}
            headers
            striped
            paginationType="advance"
            filterType="call"
          />
        </SkeletonWrapper>
      </ScrollArea>
    </CardLayout>
  );
};

export default NotificationsPage;
