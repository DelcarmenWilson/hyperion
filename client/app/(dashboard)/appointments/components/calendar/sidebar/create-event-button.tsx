import "react";
import { Plus } from "lucide-react";
import { useAppointmentContext } from "@/providers/app";
import { Button } from "@/components/ui/button";
export default function CreateEventButton() {
  const { setShowAppointmentModal } = useAppointmentContext();
  return (
    <Button
      className="gap-2 w-full"
      onClick={() => setShowAppointmentModal(true)}
    >
      <Plus size={16} /> Create
    </Button>
  );
}
