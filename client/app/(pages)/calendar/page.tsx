"use client";
import { useCalendarData } from "@/hooks/calendar/use-calendar";
import { CalendarClient } from "./components/calendar/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const AppointmentsPage = () => {
  const { isFetchingAppointments } = useCalendarData();

  return (
    <SkeletonWrapper isLoading={isFetchingAppointments}>
      <CalendarClient />
    </SkeletonWrapper>
  );
};

export default AppointmentsPage;
