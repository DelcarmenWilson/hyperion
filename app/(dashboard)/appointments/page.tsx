import React from "react";
import { currentUser } from "@/lib/auth";
import { AppointmentClient } from "./components/client";
import { appointmentsGetAllByUserId } from "@/data/appointment";

const AppointmentsPage = async () => {
  const user = await currentUser();
  const appointments = await appointmentsGetAllByUserId(user?.id!);

  return <AppointmentClient data={appointments} />;
};

export default AppointmentsPage;
