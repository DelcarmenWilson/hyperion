"use client";
import { useEffect, useState } from "react";

import { MasterAccountModal } from "@/components/modals/master-account-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <MasterAccountModal />
    </>
  );
};
