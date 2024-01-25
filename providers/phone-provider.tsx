"use client";
import { PhoneModal } from "@/components/modals/phone-modal";
import { useEffect, useState } from "react";

export const PhoneProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PhoneModal />
    </>
  );
};
