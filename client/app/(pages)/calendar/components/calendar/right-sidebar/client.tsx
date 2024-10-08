import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCalendarData } from "@/hooks/calendar/use-calendar";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { CalendarAppointment } from "@/types/appointment";
import { getAppLabelBgColor } from "@/formulas/labels";
import { format } from "date-fns";
import dayjs from "dayjs";

export const RightSidebarClient = () => {
  const { daySelected } = useCalendarStore();

  const [dayAppointments, setDayAppointments] = useState<CalendarAppointment[]>(
    []
  );
  const { filteredAppointments } = useCalendarData();

  useEffect(() => {
    const events = filteredAppointments.filter(
      (app) =>
        dayjs(app.startDate).format("DD-MM-YY") ===
        daySelected.format("DD-MM-YY")
    );
    setDayAppointments(events);
  }, [filteredAppointments, daySelected]);
  return (
    <div className="flex flex-col gap-2 border p-5 w-52">
      <h1 className="text-lg font-bold">Appointments</h1>
      <p className="text-sm font-semibold">
        {format(new Date(daySelected?.toDate()!), "PPP")}
      </p>
      {dayAppointments.map((app) => {
        const bg = getAppLabelBgColor(app.label?.color as string);
        return (
          <div key={app.id} className={cn("text-xs truncate", bg)}>
            {app.lead ? app.lead.firstName : app.title} -{" "}
            {format(app.startDate, "h:mm")}
          </div>
        );
      })}
    </div>
  );
};
