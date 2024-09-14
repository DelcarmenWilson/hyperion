import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";

import { Appointment } from "@prisma/client";
import { leadAppointmentsGetAllByLeadId } from "@/actions/lead/appointment";

export const useLeadAppointmentData = () => {
  const { leadId } = useLeadId();

  const { data: appointments, isFetching: isFetchingAppointments } = useQuery<
  Appointment[]
>({
  queryFn: () => leadAppointmentsGetAllByLeadId(leadId),
  queryKey: [`leadAppointments-${leadId}`],
});
  return {    
    appointments,
    isFetchingAppointments,
  };
};
