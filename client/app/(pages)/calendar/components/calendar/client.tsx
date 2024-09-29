"use client";
import { useEffect, useState } from "react";
import { getMonth } from "@/lib/utils";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";

import CalendarHeader from "./header";
import { SidebarClient } from "./sidebar/client";
import { Month } from "./month";
import { AppointmentModal } from "./appointment-modal";
import { LabelModal } from "./label-modal";

export const CalendarClient = () => {
  const { showAppointmentModal, showLabelModal, monthIndex } =
    useCalendarStore();
  const [currenMonth, setCurrentMonth] = useState(getMonth());

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      {showAppointmentModal && <AppointmentModal />}
      {showLabelModal && <LabelModal />}

      <div className=" flex flex-col w-full h-full bg-background overflow-hidden">
        <CalendarHeader />
        <div className="flex flex-1 h-full overflow-hidden">
          <SidebarClient />
          <Month month={currenMonth} />
        </div>
      </div>
    </>
  );
};
