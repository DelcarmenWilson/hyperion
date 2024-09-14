import { useQuery } from "@tanstack/react-query";
import { LeadStatus } from "@prisma/client";
import { leadStatusGetAllDefault } from "@/actions/lead/status";
//TODO this belong in a user folder / hooks
export const useLeadStatuses = () => {
  const { data: statuses, isFetching: isFetchingStatuses } = useQuery<
    LeadStatus[]
  >({
    queryFn: () => leadStatusGetAllDefault(),
    queryKey: [`userLeadStatuses`],
  });

  return {
    statuses,
    isFetchingStatuses,
  };
};
