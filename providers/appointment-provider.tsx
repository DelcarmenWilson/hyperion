"use client";
import { useEffect, useState } from "react";

import { AppointmentModal } from "@/components/modals/appointment-modal";

export const AppointmentProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AppointmentModal />
    </>
  );
};
