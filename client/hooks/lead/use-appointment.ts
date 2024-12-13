import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";

import { Appointment } from "@prisma/client";
import { getLeadAppointments } from "@/actions/lead/appointment";

export const useLeadAppointmentData = () => {
  const { leadId } = useLeadId();

  const { data: appointments, isFetching: isFetchingAppointments } = useQuery<
  Appointment[]
>({
  queryFn: () => getLeadAppointments(leadId),
  queryKey: [`leadAppointments-${leadId}`],
});
  return {    
    appointments,
    isFetchingAppointments,
  };
};
