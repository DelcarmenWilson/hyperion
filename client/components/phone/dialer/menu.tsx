"use client";
import { useState } from "react";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  RefreshCcw,
  X,
} from "lucide-react";
import { MdDialpad } from "react-icons/md";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhoneData } from "@/hooks/use-phone";
import { usePhoneContext } from "@/providers/phone";
import { useDialerStore } from "../hooks/use-dialer";
import { usePipelineStore } from "@/hooks/pipeline/use-pipeline-store";

import { Button } from "@/components/ui/button";

import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import { DialerSettingsType } from "@/types";
import { DialerSettings } from "./settings";
import { SmsDrawer } from "./sms-drawer";

type Props = {
  setIndex: (idx: number) => void;
};
export const DialerMenu = ({ setIndex }: Props) => {
  const user = useCurrentUser();

  const { phone } = usePhoneContext();
  const {
    lead,
    onPhoneConnect,
    onDisconnect,
    time,
    isRunning,
    isCallMuted,
    onCallMuted,
    onPhoneDialerClose,
  } = usePhoneData(phone);
  const { pipeIndex, selectedPipeline, filterLeads, timeZone } =
    usePipelineStore();
  const { isSmsFormOpen, onSmsFormToggle } = useDialerStore();

  const [dialNumber, setDialNumber] = useState(1);

  // PHONE VARIABLES
  const [settings, setSettings] = useState<DialerSettingsType>({
    matrix: 3,
    pause: 5,
  });

  const onStartCall = async () => {
    if (!phone || !lead || !user) return;

    // getting default no. for that lead
    const agentNumber =
      user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone;
    const call = await phone.connect({
      params: {
        To: reFormatPhoneNumber(lead.cellPhone),
        AgentNumber: agentNumber,
        CallDirection: "outbound",
      },
    });

    call.on("hangup", onDisconnect);
    call.on("disconnect", onDisconnect);
    onPhoneConnect(call);
  };

  const onNextLead = () => {
    setDialNumber(1);
    setIndex(1);
  };
  const onPreviousLead = () => {
    setDialNumber(1);
    setIndex(-1);
  };

  const onReset = () => setIndex(0);

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
          {isRunning ? (
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
                className="gap-2"
                variant="destructive"
                size="sm"
                onClick={onDisconnect}
              >
                <PhoneCall size={16} />
                Hangup
              </Button>
            </>
          ) : (
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
                disabled={pipeIndex == 0}
                className="gap-2"
                size="sm"
                onClick={onPreviousLead}
              >
                <ArrowLeftCircle size={16} /> Previous Lead
              </Button>
              <Button
                disabled={pipeIndex >= filterLeads?.length! - 1}
                className="gap-2"
                size="sm"
                onClick={onNextLead}
              >
                Next Lead
                <ArrowRightCircle size={16} />
              </Button>

              <Button className="gap-2" size="sm" onClick={onStartCall}>
                <Phone size={16} />
                Call
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {/* <DialerSettings
            disabled={isRunning}
            settings={settings}
            setSettings={setSettings}
          /> */}
          <Button disabled={isRunning} size="sm" onClick={onPhoneDialerClose}>
            <X size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        {/* <div className="grid grid-cols-3 text-muted-foreground"> */}
        <p>
          Stage: <span className="font-bold"> {selectedPipeline?.name}</span> -{" "}
          {pipeIndex + 1} of {filterLeads?.length} Leads{" "}
          <span className="font-bold">{timeZone}</span>
        </p>

        <div className="flex gap-2 items-center">
          <span>Call # {dialNumber}</span>
          <Button
            variant={isSmsFormOpen ? "default" : "outlineprimary"}
            onClick={onSmsFormToggle}
          >
            Sms Form
          </Button>
        </div>
        <span className="text-primary font-bold">
          {formatSecondsToTime(time)}
        </span>
      </div>
      <SmsDrawer />
    </>
  );
};
