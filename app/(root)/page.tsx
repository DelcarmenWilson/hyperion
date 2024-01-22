"use client";

import { Modal } from "@/components/custom/modal";
import { useOrganizationModal } from "@/hooks/use-organization-modal";
import { useEffect } from "react";

export default function Home() {
  const onOpen = useOrganizationModal((state) => state.onOpen);
  const isOpen = useOrganizationModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  },[isOpen,onOpen]);

  return (
    <div className="p-4">
      {/* <Modal title="Test" description="Test Desc" isOpen onClose={() => {}}>
        Children
      </Modal> */}
    </div>
  );
}
