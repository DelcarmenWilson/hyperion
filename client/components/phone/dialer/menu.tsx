"use client";
import { useEffect, useState } from "react";
import {
  ArrowRightCircle,
  Mic,
  MicOff,
  Phone,
  RefreshCcw,
  X,
} from "lucide-react";
import { MdDialpad } from "react-icons/md";
import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone, usePhoneData } from "@/hooks/use-phone";
import { usePhoneContext } from "@/providers/phone";

import { Button } from "@/components/ui/button";

import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import { DialerSettingsType } from "@/types";
import { DialerSettings } from "./settings";

type DialerMenuProps = {
  setIndex: (e?: boolean) => void;
};
export const DialerMenu = ({ setIndex }: DialerMenuProps) => {
  const user = useCurrentUser();
  const {
    call,
    isRunning,
    time,
    setTime,
    isCallMuted,
    onCallMutedToggle,
    onPhoneConnect,
    onPhoneDisconnect,
    onPhoneDialerClose,
    leads,
    lead,
    pipeline,
    pipeIndex,
  } = usePhone();
  const { phone } = usePhoneContext();
  const data = usePhoneData(
    phone,
    call,
    isCallMuted,
    onCallMutedToggle,
    () => {},
    onPhoneDisconnect,
    isRunning,
    setTime
  );
  const [dialNumber, setDialNumber] = useState(1);

  // PHONE VARIABLES
  const [settings, setSettings] = useState<DialerSettingsType>({
    matrix: 3,
    pause: 5,
  });
  const [stop, setStop] = useState(false);

  const startCall = (keepDialing: boolean = true) => {
    if (!keepDialing) {
      return;
    }
    if (!phone || !lead || !user) return;

    // getting default no. for that lead
    const agentNumber =
      user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone;
    const call = phone.connect({
      To: reFormatPhoneNumber(lead.cellPhone),
      AgentNumber: agentNumber,
      CallDirection: "outbound",
    });

    call.on("hangup", onCallDisconnect);
    call.on("disconnect", onCallDisconnect);
    onPhoneConnect(call);
  };
  const onCallDisconnect = (e: any) => {
    console.log(e);
    call?.disconnect();
    onPhoneDisconnect();
    // if(stop) return;
    // onNextCall();
  };

  const onNextCall = () => {
    call?.disconnect();
    let keepDialing = true;
    setDialNumber((num) => {
      const newNum = num + 1;
      if (pipeIndex == leads?.length! - 1 && newNum > settings.matrix) {
        keepDialing = false;
        onStopDailing();
        onReset();
        toast.success("stage completed!");
        return 1;
      }
      if (newNum > settings.matrix) {
        setIndex();
        return 1;
      }
      return newNum;
    });

    startCall(keepDialing);
  };

  const onCallMuted = () => {
    if (!call) return;
    onCallMutedToggle();
    call.mute(!isCallMuted);
  };

  const onStartDialing = () => {
    startCall();
  };

  const onStopDailing = () => {
    call?.disconnect();
    setStop(true);
    onPhoneDisconnect();
    startCall(false);
  };

  const onNextLead = () => {
    setDialNumber(1);
    setIndex();
  };

  const onReset = () => {
    setIndex(true);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <MdDialpad size={16} />
          Dialer
          <span className="text-primary font-bold italic">
            {formatPhoneNumber(lead?.cellPhone as string) || ""}
          </span>
        </div>
        <div className="flex gap-2 items-start">
          {!isRunning && (
            <>
              <Button
                variant="outlineprimary"
                size="sm"
                className="gap-2"
                onClick={onReset}
              >
                <RefreshCcw size={16} /> Reset
              </Button>
              <Button
                disabled={pipeIndex >= leads?.length! - 1}
                className="gap-2"
                size="sm"
                onClick={() => onNextLead()}
              >
                <ArrowRightCircle size={16} /> Next Lead
              </Button>
            </>
          )}

          {/* {call && ( */}
          {isRunning && (
            <>
              <Button
                className="gap-2"
                size="sm"
                variant={isCallMuted ? "destructive" : "outlinedestructive"}
                onClick={onCallMuted}
              >
                {isCallMuted ? (
                  <>
                    <MicOff size={16} /> Muted
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Mute
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="gap-2"
                size="sm"
                onClick={onNextCall}
              >
                <Phone size={16} /> Nex Call
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <DialerSettings
            disabled={isRunning}
            settings={settings}
            setSettings={setSettings}
          />
          {isRunning ? (
            <Button variant="destructive" size="sm" onClick={onStopDailing}>
              Stop Dialing
            </Button>
          ) : (
            <Button size="sm" onClick={onStartDialing}>
              Start Dialing
            </Button>
          )}
          <Button disabled={isRunning} size="sm" onClick={onPhoneDialerClose}>
            <X size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>
          Stage: {pipeline?.name} - {pipeIndex + 1} of {leads?.length} Leads
        </span>

        <span>Call # {dialNumber}</span>
        <span className="text-primary font-bold">
          {formatSecondsToTime(time)}
        </span>
      </div>
    </>
  );
};
