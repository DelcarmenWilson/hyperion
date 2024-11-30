"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startOfMonth } from "date-fns";

import { FullAppointment } from "@/types";

import { DataTable } from "@/components/tables/data-table";
import { DateRange } from "react-day-picker";
import { PageLayout } from "@/components/custom/layout/page";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./top-menu";
import { columns } from "./columns";

import {
  appointmentsGetAllByUserIdToday,
  appointmentsGetByUserIdFiltered,
} from "@/actions/appointment";

type AppointmentClientProps = {
  showDate?: boolean;
  showLink?: boolean;
};

export const AppointmentClient = ({
  showDate = false,
  showLink = false,
}: AppointmentClientProps) => {
  const user = useCurrentUser();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { data: appointments, isFetching } = useQuery<FullAppointment[]>({
    queryKey: ["agentAppointments", dateRange.to, dateRange.from],
    queryFn: () =>
      showDate
        ? appointmentsGetByUserIdFiltered(
            user?.id as string,
            dateRange?.from?.toString() as string,
            dateRange?.to?.toString() as string
          )
        : appointmentsGetAllByUserIdToday(user?.id as string),
  });

  return (
    <PageLayout
      title="Appointments"
      icon={Calendar}
      show={!showDate}
      topMenu={
        <TopMenu
          showLink={showLink}
          showDate={showDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      }
    >
      <SkeletonWrapper isLoading={isFetching}>
        <DataTable
          columns={columns}
          data={appointments || []}
          headers
          hidden={{
            status: false,
          }}
          filterType={showDate ? "appointment" : undefined}
        />
      </SkeletonWrapper>
    </PageLayout>
  );
};
