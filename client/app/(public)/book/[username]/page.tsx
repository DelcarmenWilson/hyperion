"use client";

import { BookAgentClient } from "./components/client";
import { useAppointmentActions } from "../hooks/use-appointment";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { ErrorCard } from "../components/error-card";

const BookAgentPage = () => {
  const {
    username,
    user,
    appointments,
    isFetchingAppointments,
    lead,
    schedule,
  } = useAppointmentActions();
  if (!username) return <ErrorCard />;
  if (!schedule || !appointments) return;

  return (
    <SkeletonWrapper isLoading={isFetchingAppointments}>
      <BookAgentClient
        userId={user?.id!}
        userImage={user?.image!}
        schedule={schedule!}
        lead={lead!}
        appointments={appointments}
      />
    </SkeletonWrapper>
  );
};

export default BookAgentPage;
