"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { FullAppointment } from "@/types";

import { DataTable } from "@/components/tables/data-table";
import { DateRange } from "react-day-picker";
import { PageLayout } from "@/components/custom/layout/page";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { TopMenu } from "./top-menu";
import { columns } from "./columns";

import { weekStartEnd } from "@/formulas/dates";
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
  const queryClient = useQueryClient();
  const [dates, setDates] = useState<DateRange | undefined>(weekStartEnd());

  const { data: appointments, isFetching } = useQuery<FullAppointment[]>({
    queryKey: ["agentAppointments"],
    queryFn: () =>
      showDate
        ? appointmentsGetByUserIdFiltered(
            user?.id as string,
            dates?.from?.toString() as string,
            dates?.to?.toString() as string
          )
        : appointmentsGetAllByUserIdToday(user?.id as string),
  });

  const onDateSelected = (e: DateRange) => {
    if (!e) return;
    setDates(e);
    invalidate();
  };

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentAppointments"],
    });
  };

  return (
    <PageLayout
      title="Appointments"
      icon={Calendar}
      show={!showDate}
      topMenu={
        <TopMenu
          showLink={showLink}
          showDate={showDate}
          onDateSelected={onDateSelected}
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
