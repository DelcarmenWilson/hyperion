"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { DialerModal } from "@/components/modals/dialer-modal";
import { PhoneModal } from "@/components/modals/phone-modal";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Device } from "twilio-client";
import { usePhoneModal } from "@/hooks/use-phone-modal";

export const PhoneProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useCurrentUser();
  const usePm = usePhoneModal();

  useEffect(() => {
    if (!user?.phoneNumbers.length) return;
    axios.post("/api/token", { identity: user?.id }).then((response) => {
      const data = response.data;
      usePm.onLoad(new Device(data.token));
    });

    setIsMounted(true);
  }, []);

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
