"use client";
import React, { useEffect, useState } from "react";
import { Connection } from "twilio-client";
import { AlertCircle, Mic, MicOff, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { numbers } from "@/constants/phone-numbers";
import { PhoneType } from "@/types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatPhoneNumber, reFormatPhoneNumber } from "@/formulas/phones";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  chatSettingsUpdateCoach,
  chatSettingsUpdateRecord,
} from "@/actions/chat-settings";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { usePhoneContext } from "@/providers/phone-provider";

export const PhoneOut = () => {
  const { update } = useSession();
  const user = useCurrentUser();
  const { lead } = usePhoneModal();
  const { phone } = usePhoneContext();
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);
  // PHONE VARIABLES

  const [toName, setToName] = useState(lead ? leadFullName : "New Call");
  const [toNumber, setToNumber] = useState(
    formatPhoneNumber(lead?.cellPhone as string) || ""
  );
  const [record, setRecord] = useState(user?.record);
  const [coach, setCoach] = useState(false);

  const [myPhoneNumbers, setMyPhoneNumbers] = useState<PhoneType[]>([]);
  const [selectedNumber, setSelectedNumber] = useState(
    lead?.defaultNumber || user?.phoneNumbers[0]?.phone || ""
  );

  const [call, setCall] = useState<Connection>();
  const [isCallMuted, setIsCallMuted] = useState(false);

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
      setToNumber((state) => formatPhoneNumber(state));
      axios
        .post("/api/leads/details", { phone: reFormatPhoneNumber(toNumber) })
        .then((response) => {
          const { id, cellPhone, firstName, lastName } = response.data;
          if (id) {
            setToName(`${firstName} ${lastName}`);
          }
        });
    }

    const call = phone.connect({
      To: reFormatPhoneNumber(toNumber),
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
    setCall(undefined);
  };

  const onNumberClick = (num: string) => {
    if (call) {
      call.sendDigits(num);
    } else {
      setToNumber((state) => (state += num));
      onCheckNumber();
    }
  };

  const onNumberTyped = (num: string) => {
    setToNumber(num);
    setDisabled(num.length > 9 ? true : false);
  };

  const onCheckNumber = () => {
    if (toNumber.length > 9) {
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
    setToName("");
    setToNumber("");
    setDisabled(false);
  };

  useEffect(() => {
    return () => onCheckNumber();
  });

  useEffect(() => {
    const startupClient = () => {
      if (!user?.phoneNumbers.length) {
        console.log("no phone number has been set up");
        return;
      }
      const numbers: PhoneType[] = user.phoneNumbers.map((p) => ({
        value: p.phone,
        state: p.state,
      }));
      setMyPhoneNumbers(numbers);
      addDeviceListeners();
    };
    return () => startupClient();
  });

  return (
    <div className="flex flex-col gap-2 p-2">
      {toName}
      <div className="relative">
        <Input
          placeholder="Phone Number"
          value={toNumber}
          maxLength={10}
          onChange={(e) => onNumberTyped(e.target.value)}
        />
        <X
          className={cn(
            "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
            toNumber.length == 0 ? "opacity-0" : "opacity-100"
          )}
          onClick={onReset}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="w-40">Caller Id</span>
        <Select
          name="ddlState"
          disabled={!!call}
          defaultValue={selectedNumber}
          onValueChange={(e) => setSelectedNumber(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Smart local Id" />
          </SelectTrigger>
          <SelectContent>
            {myPhoneNumbers.map((phone) => (
              <SelectItem key={phone.value} value={phone.value}>
                {formatPhoneNumber(phone.value)} | {phone.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      <div className="flex items-center text-sm gap-2">
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
      </div>
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
