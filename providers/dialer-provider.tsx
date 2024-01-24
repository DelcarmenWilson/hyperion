"use client";
import { DialerModal } from "@/components/modals/dialer-modal";
import { useEffect, useState } from "react";

export const DialerProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DialerModal />
    </>
  );
};
