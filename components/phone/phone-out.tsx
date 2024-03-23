"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Mic, MicOff, Phone, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import axios from "axios";

import { useCurrentUser } from "@/hooks/use-current-user";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { usePhoneContext } from "@/providers/phone";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { PhoneSwitcher } from "./addins/switcher";

import { numbers } from "@/constants/phone-numbers";
import { PhoneType } from "@/types";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import {
  chatSettingsUpdateCoach,
  chatSettingsUpdateRecord,
} from "@/actions/chat-settings";

export const PhoneOut = () => {
  const { update } = useSession();
  const user = useCurrentUser();
  const { lead } = usePhoneModal();
  const { phone, call, setCall } = usePhoneContext();
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);

  // PHONE VARIABLES
  const [to, setTo] = useState<{ name: string; number: string }>({
    name: lead ? leadFullName : "New Call",
    number: formatPhoneNumber(lead?.cellPhone as string) || "",
  });
  const [record, setRecord] = useState(user?.record);
  const [coach, setCoach] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
      user?.phoneNumbers[0]?.phone ||
      ""
  );

  const [isCallMuted, setIsCallMuted] = useState(false);

  const startupClient = () => {
    if (!user?.phoneNumbers.length) {
      console.log("no phone number has been set up");
      return;
    }
    // const leadNumber =
    //   user.phoneNumbers.find((e) => e.phone == lead?.defaultNumber)?.phone ||
    //   user?.phoneNumbers[0]?.phone ||
    //   "";
    // console.log(user.phoneNumbers, lead?.defaultNumber, leadNumber);
    // setSelectedNumber(leadNumber);
    addDeviceListeners;
  };

  const addDeviceListeners = () => {
    if (!phone) return;
    phone.on("ready", function () {
      console.log("ready");
    });

    phone.on("error", function (error: any) {});
  };

  const onStarted = () => {
    if (!phone) return;
    if (!lead) {
      setTo((state) => {
        return { ...state, number: formatPhoneNumber(state.number) };
      });
      axios
        .post("/api/leads/details", { phone: reFormatPhoneNumber(to.number) })
        .then((response) => {
          const { id, cellPhone, firstName, lastName } = response.data;
          if (id) {
            setTo((state) => {
              return { ...state, name: `${firstName} ${lastName}` };
            });
          }
        });
    }

    const call = phone.connect({
      To: reFormatPhoneNumber(to.number),
      AgentNumber: selectedNumber as string,
      Recording: record ? "record-from-answer-dual" : "do-not-record",
      Coach: coach ? "on" : "off",
      Direction: "outbound",
    });

    call.on("disconnect", onDisconnect);
    setCall(call);
  };

  const onDisconnect = () => {
    call?.disconnect();
    setCall(null);
  };

  const onNumberClick = (num: string) => {
    if (call) {
      call.sendDigits(num);
    } else {
      setTo((state) => {
        return { ...state, number: (state.number += num) };
      });
      onCheckNumber();
    }
  };

  const onNumberTyped = (num: string) => {
    setTo((state) => {
      return { ...state, number: num };
    });
    setDisabled(num.length > 9 ? true : false);
  };

  const onCheckNumber = () => {
    if (to.number.length > 9) {
      setDisabled(true);
    }
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

  const onCoachUpdate = () => {
    setCoach((state) => !state);
    chatSettingsUpdateCoach(!coach).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.error(data.success);
      }
    });
  };

  const onCallMuted = () => {
    if (call) {
      call.mute(false);
      setIsCallMuted((state) => {
        call.mute(!state);
        return !state;
      });
    }
  };

  const onReset = () => {
    setTo({ name: "", number: "" });
    setDisabled(false);
  };

  useEffect(() => {
    onCheckNumber();
  }, []);

  useEffect(() => {
    startupClient();
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2">
      {to.name}
      <div className="relative">
        <Input
          placeholder="Phone Number"
          value={to.number}
          maxLength={10}
          onChange={(e) => onNumberTyped(e.target.value)}
        />
        <X
          className={cn(
            "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
            to.number.length == 0 ? "opacity-0" : "opacity-100"
          )}
          onClick={onReset}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="w-40">Caller Id</span>
        <PhoneSwitcher
          number={selectedNumber}
          onSetDefaultNumber={setSelectedNumber}
        />
      </div>
      <div className="flex  items-center text-sm gap-2">
        <AlertCircle className="h-4 w-4" /> Call recording
        <div className="ml-auto flex gap-2">
          Off
          <Switch
            disabled={!!call}
            checked={record}
            onCheckedChange={onRecordUpdate}
          />
          On
        </div>
      </div>
      {/* <div className="flex items-center text-sm gap-2">
        <AlertCircle className="h-4 w-4" /> Agent coaching
        <div className="ml-auto flex gap-2">
          Off{" "}
          <Switch
            disabled={!!call}
            checked={coach}
            onCheckedChange={onCoachUpdate}
          />
          On
        </div>
      </div> */}
      <div className="grid grid-cols-3 gap-1">
        {numbers.map((number) => (
          <Button
            key={number.value}
            className="flex-col gap-1 h-14"
            variant="outlineprimary"
            onClick={() => onNumberClick(number.value)}
          >
            <p>{number.value}</p>
            <p>{number.letters}</p>
          </Button>
        ))}
      </div>
      {!call ? (
        <Button disabled={!disabled} onClick={onStarted}>
          <Phone className="h-4 w-4 mr-2" /> Call
        </Button>
      ) : (
        <Button variant="destructive" onClick={onDisconnect}>
          <Phone className="h-4 w-4 mr-2" /> Hang up
        </Button>
      )}
      {call && (
        <Button
          variant={isCallMuted ? "destructive" : "outlinedestructive"}
          onClick={onCallMuted}
        >
          {isCallMuted ? (
            <span className="flex gap-2">
              <MicOff className="h-4 w-4 mr-2" /> CALL IS MUTED
            </span>
          ) : (
            <span className="flex gap-2">
              <Mic className="h-4 w-4 mr-2" /> Mute
            </span>
          )}
        </Button>
      )}
    </div>
  );
};
