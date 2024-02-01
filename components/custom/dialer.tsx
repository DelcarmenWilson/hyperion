"use client";
import React, { useEffect, useState } from "react";
import { Connection } from "twilio-client";
import { AlertCircle, Phone, X } from "lucide-react";
import { device } from "@/lib/device";
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
import { useDialerModal } from "@/hooks/use-dialer-modal";
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

export const Dialer = () => {
  const { update } = useSession();
  const user = useCurrentUser();
  const { lead } = useDialerModal();
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
    lead?.defaultNumber || user?.phoneNumbers[0].phone || ""
  );

  const [call, setCall] = useState<Connection>();

  const startupClient = () => {
    if (!user?.phoneNumbers.length) {
      console.log("no phone number have been set up");
      return null;
    }
    const numbers: PhoneType[] = user.phoneNumbers.map((p) => {
      return { value: p.phone, state: p.state };
    });
    setMyPhoneNumbers(numbers);
    addDeviceListeners;
  };

  function addDeviceListeners() {
    if (!device) return;
    device.on("ready", function () {
      console.log("ready");
    });

    device.on("error", function (error: any) {});
  }

  const onCallStarted = () => {
    if (!device) return;
    if (!lead) {
      setToNumber((state) => formatPhoneNumber(state));

      axios
        .post("/api/leads/details", { phone: reFormatPhoneNumber(toNumber) })
        .then((response) => {
          const { id, cellPhone, firstName, lastName } = response.data;
          if (id) {
            console.log(id, cellPhone, firstName, lastName);
            setToName(`${firstName} ${lastName}`);
          }
        });
    }

    const call = device.connect({
      To: reFormatPhoneNumber(toNumber),
      AgentNumber: selectedNumber as string,
      Recording: record ? "record-from-answer-dual" : "do-not-record",
      Coach: coach ? "on" : "off",
      Direction: "outbound",
    });

    call.on("disconnect", onCallDisconnect);

    setCall(call);
  };

  const onCallDisconnect = () => {
    call?.disconnect();
    setCall(undefined);
  };

  const onNumberClick = (num: string) => {
    setToNumber((state) => (state += num));
    onCheckNumber();
  };

  const onNumberTyped = (num: string) => {
    setToNumber(num);
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
  const onReset = () => {
    setToNumber("");
    setDisabled(false);
  };

  useEffect(() => {
    onCheckNumber();
  }, []);

  useEffect(() => {
    startupClient();
  }, []);

  return (
    <div className="flex">
      {/* <div className="flex flex-col gap-2 p-4">hello</div> */}
      <div className="flex flex-col gap-2 p-4">
        {toName}
        <div className="relative">
          <Input
            placeholder="Phone Number"
            value={toNumber}
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
            />{" "}
            On
          </div>
        </div>
        {/* <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4" /> Agent coaching
          </div>
          <div className="flex gap-2">
            Off <Switch /> On
          </div>
        </div> */}
        <div className="grid grid-cols-3 gap-1">
          {numbers.map((number) => (
            <Button
              key={number.value}
              disabled={disabled}
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
          <Button disabled={!disabled} onClick={onCallStarted}>
            <Phone className="h-4 w-4 mr-2" /> Call
          </Button>
        ) : (
          <Button variant="destructive" onClick={onCallDisconnect}>
            <Phone className="h-4 w-4 mr-2" /> Hang up
          </Button>
        )}
      </div>
    </div>
  );
};
