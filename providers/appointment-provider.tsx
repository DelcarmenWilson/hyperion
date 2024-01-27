"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { device } from "@/lib/device";
import { AppointmentModal } from "@/components/modals/appointment-modal";

import { useCurrentUser } from "@/hooks/use-current-user";

export const AppointmentProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  // const [device, setDevice] = useState<Device>();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.phoneNumbers.length) return;
    axios.post("/api/token", { identity: user?.id }).then((response) => {
      const data = response.data;
      device.setup(data.token, {
        logLevel: 1,
      });
    });

    setIsMounted(true);
  }, [device]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AppointmentModal />
    </>
  );
};
