import React from "react";
import { currentUser } from "@/lib/auth";
import { AppointmentColumn } from "./components/columns";
import { AppointmentBox } from "./components/appointment-box";
import { appointmentsGetAllByUserId } from "@/data/appointment";

const AppointmentsPage = async () => {
  const user = await currentUser();
  const appointments = await appointmentsGetAllByUserId(user?.id!);

  const formattedAppointments: AppointmentColumn[] = appointments.map(
    (apt) => ({
      id: apt.id,
      fullName: `${apt.lead.firstName} ${apt.lead.lastName}`,
      email: apt.lead.email,
      phone: apt.lead.cellPhone,
      status: apt.status,
      dob: apt.lead.dateOfBirth || undefined,
      date: apt.date,
      comments: apt.comments,
    })
  );
  return <AppointmentBox data={formattedAppointments} />;
};

export default AppointmentsPage;
