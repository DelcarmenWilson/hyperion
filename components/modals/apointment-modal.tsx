import { useEffect, useState } from "react";
import { Modal } from "@/components/custom/modal";
import { Button } from "@/components/ui/button";

interface AppointmentModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
export const AppointmentModal = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AppointmentModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const forTitle = `Appointment for ${title}`;
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={forTitle}
      description="Set an apointment"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 felex items-center text-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={loading} onClick={onConfirm}>
          Schedule
        </Button>
      </div>
    </Modal>
  );
};
