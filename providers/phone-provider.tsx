"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { device } from "@/lib/device";
import { DialerModal } from "@/components/modals/dialer-modal";
import { PhoneModal } from "@/components/modals/phone-modal";

import { useCurrentUser } from "@/hooks/use-current-user";

export const PhoneProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
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
      <DialerModal />
      <PhoneModal />
    </>
  );
};
