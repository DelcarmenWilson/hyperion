"use client";
import { useEffect, useState } from "react";

import { MasterAccountModal } from "@/components/modals/master-account";

export const MasterModalProvider = () => {
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
