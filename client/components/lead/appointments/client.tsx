"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { userEmitter } from "@/lib/event-emmiter";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageLayout } from "@/components/custom/layout/page-layout";
import { TopMenu } from "./top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

import { FullAppointment } from "@/types";
import { weekStartEnd } from "@/formulas/dates";
import {
  appointmentsGetAllByUserIdToday,
  appointmentsGetByUserIdFiltered,
} from "@/actions/appointment";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { DateRange } from "react-day-picker";
import { AppointmentDetailsModal } from "@/components/modals/appointment-details";

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

  // useEffect(() => {
  //   userEmitter.on("appointmentUpdated", invalidate);
  // }, [user?.id]);

  return (
    <>
      <AppointmentDetailsModal />
      <PageLayout
        title="Appointments"
        icon={Calendar}
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
          {/* {JSON.stringify(appointments)} */}
        </SkeletonWrapper>
      </PageLayout>
    </>
  );
};
