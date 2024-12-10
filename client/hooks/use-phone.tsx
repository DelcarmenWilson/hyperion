import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePhoneStore } from "@/stores/phone-store";

import { Device } from "@twilio/voice-sdk";

import {
  phoneSettingsUpdateCurrentCall,
  phoneSettingsUpdateRemoveCurrentCall,
} from "@/actions/settings/phone";

import { getLeadByPhone } from "@/actions/lead";

export const usePhoneData = (phone: Device | null) => {
  const {
    call,
    isRunning,
    time,
    setTime,
    isCallMuted,
    onCallMutedToggle,
    onPhoneInConnect,
    onPhoneConnect,
    onPhoneDisconnect,
    onPhoneDialerClose,
    leads,
    lead,
    pipeline,
  } = usePhoneStore();

  //GENERAL FUNCTIIONS
  ///Disconnect an in progress call
  const onDisconnect = () => {
    call?.disconnect();
    onPhoneDisconnect();
    phone?.calls.forEach((call) => {
      call.disconnect();
    });
    phoneSettingsUpdateRemoveCurrentCall();
  };
  const onCallMuted = () => {
    if (call) {
      call.mute(!isCallMuted);
      onCallMutedToggle();
    }
  };

  //INCOMING FUNCTIONS
  ///Accept an incoming call
  const onIncomingCallAccept = () => {
    if (!call) return;
    call.accept();
    //TODO - this is not working as intended
    phoneSettingsUpdateCurrentCall(call.parameters.CallSid);
    onPhoneInConnect();
  };
  //Disconnect an in progress call - Direct the call to voicemail
  const onIncomingCallReject = () => {
    call?.reject();
    onPhoneDisconnect();
  };

  //TIME FUNCTION
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTime();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    call,
    lead,
    leads,
    onPhoneConnect,
    onPhoneDisconnect,
    onDisconnect,
    time,
    isRunning,
    isCallMuted,
    onCallMuted,
    onCallMutedToggle,
    onIncomingCallAccept,
    onIncomingCallReject,
    pipeline,
    onPhoneDialerClose,
  };
};

export const useIncomingCallData = () => {
  // const { phone } = usePhoneContext();
  // const { onPhoneInOpen, isPhoneOutOpen, onIncomingCallOpen } = usePhoneStore();
  // const { onDisconnect } = usePhoneData(phone);
  // PHONE VARIABLES
  const [from, setFrom] = useState<{
    id: string | undefined;
    name: string;
    number: string;
  }>({
    id: undefined,
    name: "unknown",
    number: "unknown",
  });

  const onGetLeadByPhone = (cellPhone: string) => {
    const {
      data: lead,
      isFetching: leadFetching,
      isLoading: leadLoading,
    } = useQuery<{ id: string; firstName: string; lastName: string } | null>({
      queryFn: () => getLeadByPhone(cellPhone as string),
      queryKey: [`lead-by-phone-${cellPhone}`],
      enabled: !!cellPhone,
    });
    return { lead, leadFetching, leadLoading };
  };

  return { from, setFrom, onGetLeadByPhone };
};
