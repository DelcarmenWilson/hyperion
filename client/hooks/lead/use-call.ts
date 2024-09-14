import { useLeadId } from "./use-lead";
import { useQuery } from "@tanstack/react-query";

import { FullCall } from "@/types";
import { callsGetAllByLeadId } from "@/actions/call";

export const useLeadCallData = () => {
  const { leadId } = useLeadId();

  const { data: calls, isFetching: isFetchingCalls } = useQuery<FullCall[]>({
    queryFn: () => callsGetAllByLeadId(leadId),
    queryKey: [`leadCalls-${leadId}`],
  });

  return {
    calls,
    isFetchingCalls,
  };
};
