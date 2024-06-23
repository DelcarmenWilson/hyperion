"use client";

import { useAppointment } from "@/hooks/use-appointment";
import { AppointmentForm } from "@/components/custom/appointment-form";
import { DrawerRight } from "../custom/drawer-right";

export const AppointmentModal = () => {
  const { isFormOpen, onFormClose } = useAppointment();

  return (
    <DrawerRight
      title="New appointment"
      isOpen={isFormOpen}
      onClose={onFormClose}
    >
      <AppointmentForm />
    </DrawerRight>
  );
};
