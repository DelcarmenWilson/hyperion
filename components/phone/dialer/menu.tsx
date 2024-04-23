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

import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhone } from "@/hooks/use-phone";
import { usePhoneContext } from "@/providers/phone";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { formatSecondsToTime } from "@/formulas/numbers";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import { Switch } from "@/components/ui/switch";
import { chatSettingsUpdateRecord } from "@/actions/chat-settings";

type DialerMenuProps = {
  setIndex: (e?: boolean) => void;
};
export const DialerMenu = ({ setIndex }: DialerMenuProps) => {
  const user = useCurrentUser();
  const { update } = useSession();
  const { onPhoneDialerClose, leads, lead, pipeline, pipIndex } = usePhone();

  const [dialMatrix, setDialMatrix] = useState(2);
  const [dialNumber, setDialNumber] = useState(1);
  const [dialing, setDialing] = useState(false);

  // PHONE VARIABLES
  const { phone, call, setCall } = usePhoneContext();
  const [record, setRecord] = useState(user?.record);
  const [coach, setCoach] = useState(false);
  const [isCallMuted, setIsCallMuted] = useState(false);

  const [time, setTime] = useState(0);

  function addDeviceListeners() {
    if (!phone) return;
    phone.on("ready", function () {
      console.log("Dialer ready");
    });

    phone.on("error", function (error: any) {
      console.log(error);
    });
  }

  const startCall = (dial: boolean = true) => {
    if (!dial) return;
    if (!phone || !lead || !user) return;
    const agentNumber =
      user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone;
    // console.log(
    //   "agentNumber:",
    //   agentNumber,
    //   "leadNumber",
    //   lead.cellPhone,
    //   "leadsLength:",
    //   leads?.length,
    //   "dialMatrix",
    //   dialMatrix,
    //   "dialNumber",
    //   dialNumber,
    //   "pipIndex",
    //   pipIndex
    // );
    const call = phone.connect({
      To: reFormatPhoneNumber(lead.cellPhone),
      AgentNumber: agentNumber,
      Recording: record ? "record-from-answer-dual" : "do-not-record",
      Coach: coach ? "on" : "off",
      Direction: "outbound",
    });

    call.on("disconnect", onNextCall);
    setCall(call);
  };

  const onNextCall = () => {
    call?.disconnect();
    let dial = true;
    setDialNumber((num) => {
      const newNum = num + 1;
      if (pipIndex == leads?.length! - 1 && newNum > dialMatrix) {
        dial = false;
        onStopDailing();
        onReset();
        toast.success("stage completed!");
        return 1;
      }
      if (newNum > dialMatrix) {
        setIndex();
        return 1;
      }
      return newNum;
    });

    startCall(dial);
  };

  const onCallMuted = () => {
    if (!call) return;
    setIsCallMuted((state) => {
      call.mute(!state);
      return !state;
    });
  };

  const onStartDialing = () => {
    setDialing(true);
    startCall();
  };

  const onStopDailing = () => {
    call?.disconnect();
    setCall(call);
    setDialing(false);
    startCall(false);
  };

  const onNextLead = () => {
    setDialNumber(1);
    setIndex();
  };

  const onRecordUpdate = () => {
    setRecord((state) => !state);
    update();
    chatSettingsUpdateRecord(!record).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.error(data.success);
      }
    });
  };

  const onReset = () => {
    setIndex(true);
  };

  useEffect(() => {
    let interval: any;
    if (dialing) {
      interval = setInterval(() => {
        setTime((state) => state + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [dialing]);

  useEffect(() => {
    addDeviceListeners();
  }, []);

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
        <div className="flex gap-2">
          {user?.role != "ASSISTANT" && (
            <div className="flex items-center text-sm gap-2">
              Recording
              <Switch
                disabled={dialing}
                checked={record}
                onCheckedChange={onRecordUpdate}
              />
            </div>
          )}
          {!dialing && (
            <>
              <Button
                variant="outlineprimary"
                className="gap-2"
                onClick={onReset}
              >
                <RefreshCcw size={16} /> Reset
              </Button>
              <Button
                disabled={pipIndex >= leads?.length! - 1}
                className="gap-2"
                onClick={() => onNextLead()}
              >
                <ArrowRightCircle size={16} /> Next Lead
              </Button>
            </>
          )}

          {/* {call && ( */}
          {dialing && (
            <>
              <Button
                className="gap-2"
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
                onClick={onNextCall}
              >
                <Phone size={16} /> Nex Call
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <span>Dial Matrix</span>
          <Input
            className="w-15"
            disabled={dialing}
            value={dialMatrix}
            onChange={(e) => setDialMatrix(parseInt(e.target.value))}
            type="number"
          />
          {dialing ? (
            <Button variant="destructive" onClick={onStopDailing}>
              Stop Dialing
            </Button>
          ) : (
            <Button onClick={onStartDialing}>Start Dialing</Button>
          )}
          <Button disabled={dialing} size="icon" onClick={onPhoneDialerClose}>
            <X size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>
          Stage: {pipeline?.name} - {pipIndex + 1} of {leads?.length} Leads
        </span>

        <span>Call # {dialNumber}</span>
        <span className="text-primary font-bold">
          {formatSecondsToTime(time)}
        </span>
      </div>
    </>
  );
};
