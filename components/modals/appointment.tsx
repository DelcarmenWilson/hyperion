"use client";

import { useAppointmentModal } from "@/hooks/use-appointment-modal";
import { AppointmentForm } from "@/components/custom/appointment-form";
import { DrawerRight } from "../custom/drawer-right";

export const AppointmentModal = () => {
  const { isOpen, onClose } = useAppointmentModal();

  return (
    <DrawerRight title="New appointment" isOpen={isOpen} onClose={onClose}>
      <AppointmentForm />
    </DrawerRight>
  );
};
