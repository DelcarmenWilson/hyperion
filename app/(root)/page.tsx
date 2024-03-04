"use client";

import { useMasterAccountModal } from "@/hooks/use-master-account-modal";
import { useEffect } from "react";

export default function Home() {
  const onOpen = useMasterAccountModal((state) => state.onOpen);
  const isOpen = useMasterAccountModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      {/* <Modal title="Test" description="Test Desc" isOpen onClose={() => {}}>
        Children
      </Modal> */}
    </div>
  );
}
