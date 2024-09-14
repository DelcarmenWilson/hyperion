import { useEffect, useState } from "react";
import { Modal } from "@/components/modals/modal";
import { Button } from "@/components/ui/button";

type AlertModalProps = {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  height?: string;
};
export const AlertModal = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  isOpen,
  onClose,
  onConfirm,
  loading,
  height = "h-full",
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
      height={height}
    >
      <div className="pt-6 pb-1 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
