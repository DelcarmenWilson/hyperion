import React from "react";
import { currentUser } from "@/lib/auth";

import { AppointmentClient } from "@/components/lead/appointments/client";
import { CalendarClient } from "./components/calendar/client";

const AppointmentsPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  return (
    <AppointmentClient showDate />
    // <CalendarClient />
  );
};

export default AppointmentsPage;
