"use client";
import { useAppointmentActions } from "../../hooks/use-appointment";
import { AppointmentRescheduleClient } from "./components/client";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ErrorCard } from "../../components/error-card";

const AppointmentReschedulePage = () => {
  const {
    appointmentId,
    user,
    appointment,
    appointments,
    isFetchingAppointments,
    schedule,
  } = useAppointmentActions();
  if (!appointmentId) return <ErrorCard />;
  if (!schedule || !appointments) return;

  return (
    <SkeletonWrapper isLoading={isFetchingAppointments}>
      <AppointmentRescheduleClient
        userImage={user?.image!}
        schedule={schedule!}
        appointment={appointment!}
        appointments={appointments}
      />
    </SkeletonWrapper>
  );
};

export default AppointmentReschedulePage;
