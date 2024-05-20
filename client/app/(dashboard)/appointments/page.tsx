import React from "react";
import { currentUser } from "@/lib/auth";

import { AppointmentClient } from "@/components/lead/appointments/client";
import { appointmentsGetByUserIdFiltered } from "@/data/appointment";
import { weekStartEnd } from "@/formulas/dates";
import { CalendarClient } from "./components/calendar/client";

const AppointmentsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const week = weekStartEnd();
  const from = (searchParams.from || week.from.toString()) as string;
  const to = (searchParams.to || week.to.toString()) as string;
  const appointments = await appointmentsGetByUserIdFiltered(user.id, from, to);

  return (
    //<AppointmentClient data={appointments} showDate />
    <CalendarClient />
  );
};

export default AppointmentsPage;
