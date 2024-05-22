"use client";
import { useEffect, useState } from "react";
import { getMonth } from "@/lib/utils";

import CalendarHeader from "./header";
import { useAppointmentContext } from "@/providers/app";
import { SidebarClient } from "./sidebar/client";
import { Month } from "./month";
import { AppointmentModal } from "./appointment-modal";
import { LabelModal } from "./label-modal";

export const CalendarClient = () => {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showAppointmentModal, showLabelModal } =
    useAppointmentContext();

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);
  return (
    <>
      {showAppointmentModal && <AppointmentModal />}
      {showLabelModal && <LabelModal />}

      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <CalendarHeader />
        <div className="flex flex-1 overflow-hidden">
          <SidebarClient />
          <Month month={currenMonth} />
        </div>
      </div>
    </>
  );
};
