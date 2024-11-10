import "react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateEventButton = () => {
  const { setShowAppointmentModal } = useCalendarStore();
  return (
    <Button
      className="gap-2 w-full"
      onClick={() => setShowAppointmentModal(true)}
    >
      <Plus size={16} /> Create
    </Button>
  );
};

export default CreateEventButton;
