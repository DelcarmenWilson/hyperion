"use client";
import { useEffect } from "react";
import { useMasterAccountStore } from "@/stores/master-account-store";

export default function Home() {
  const { isOpen, onOpen } = useMasterAccountStore();

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      {/* <Modal title="Test" description="Test Desc" isOpen onClose={() => {}}>
        Children
      </Modal> */}
    </div>
  );
}
