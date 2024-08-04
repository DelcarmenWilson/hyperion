import { appointmentsGetById } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import { useAppointment } from "@/hooks/use-appointment";
import React from "react";

export const AppButton = ({
  appointmentId,
}: {
  appointmentId: string | null;
}) => {
  if (!appointmentId) return null;
  const { onDetailsOpen } = useAppointment();
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
