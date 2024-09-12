import { appointmentsGetById } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/hooks/use-appointment";
import React from "react";

export const AppButton = ({
  appointmentId,
}: {
  appointmentId: string | null;
}) => {
  const { onDetailsOpen } = useAppointmentStore();
  if (!appointmentId) return null;

  const onAppDetails = async () => {
    const app = await appointmentsGetById(appointmentId);
    if (!app) return;
    onDetailsOpen(app);
  };
  return (
    <Button variant="outlineprimary" size="sm" onClick={onAppDetails}>
      Details
    </Button>
  );
};
