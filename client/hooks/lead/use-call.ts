import { useQuery } from "@tanstack/react-query";

import { FullCall, ShortCall } from "@/types";
import {
  getCallsForLead,
  getInboundCalls,
  getMissedCalls,
  getMultipleCalls,
  getOutboundCalls,
} from "@/actions/call";
import { useCallStore } from "@/stores/call-store";


export const useLeadCallData = () => {
  const { callIds } = useCallStore();
  const onGetCalls = (leadId: string) => {
    const {
      data: calls,
      isFetching: callsFetching,
      isLoading: callsLoading,
    } = useQuery<FullCall[]>({
      queryFn: () => getCallsForLead(leadId),
      queryKey: [`leadCalls-${leadId}`],
    });

    return {
      calls,
      callsFetching,
      callsLoading,
    };
  };
  const onGetMultipleCalls = () => {
    const {
      data: calls,
      isFetching: callsFetching,
      isLoading: callsLoading,
    } = useQuery<ShortCall[]>({
      queryFn: () => getMultipleCalls({ callIds }),
      queryKey: [`calls-${callIds}`],
      enabled: !!callIds,
    });

    return {
      calls,
      callsFetching,
      callsLoading,
    };
  };

  const onInboundCalls = () => {
    const {
      data: inboundCalls,
      isFetching: inboundCallsFetching,
      isLoading: inboundCallsLoading,
    } = useQuery<ShortCall[]>({
      queryFn: () => getInboundCalls(),
      queryKey: ["calls-inbound"],
    });

    return {
      inboundCalls,
      inboundCallsFetching,
      inboundCallsLoading,
    };
  };
  const onOutboundCalls = () => {
    const {
      data: outboundCalls,
      isFetching: outboundCallsFetching,
      isLoading: outboundCallsLoading,
    } = useQuery<ShortCall[]>({
      queryFn: () => getOutboundCalls(),
      queryKey: ["calls-outbound"],
    });

    return {
      outboundCalls,
      outboundCallsFetching,
      outboundCallsLoading,
    };
  };
  const onMissedCalls = () => {
    const {
      data: missedCalls,
      isFetching: missedCallsFetching,
      isLoading: missedCallsLoading,
    } = useQuery<ShortCall[]>({
      queryFn: () => getMissedCalls(),
      queryKey: ["calls-missed"],
    });

    return {
      missedCalls,
      missedCallsFetching,
      missedCallsLoading,
    };
  };

  return {
    onGetCalls,
    onGetMultipleCalls,
    onInboundCalls,
    onOutboundCalls,
    onMissedCalls,
  };
};
