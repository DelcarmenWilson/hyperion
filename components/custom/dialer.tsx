"use client";
import React, { useEffect, useState } from "react";
import { Connection } from "twilio-client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertCircle, Phone, X } from "lucide-react";
import { Switch } from "../ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { numbers } from "@/constants/phone-numbers";
import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PhoneType } from "@/types";
import { device } from "@/lib/device";

interface DialerProps {
  lead?: LeadColumn;
}
export const Dialer = ({ lead }: DialerProps) => {
  const user = useCurrentUser();
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);
  // PHONE VARIABLES

  const [toNumber, setToNumber] = useState(lead?.cellPhone || "");
  const [myPhoneNumbers, setMyPhoneNumbers] = useState<PhoneType[]>([]);
  const [selectedNumber, setSelectedNumber] = useState(
    user?.phoneNumbers[0].phone || ""
  );

  const [outGoingCall, setOutGoingCall] = useState<Connection>();

  async function startupClient() {
    if (!user?.phoneNumbers.length) {
      console.log("no phone number have been set up");
      return null;
    }
    const numbers: PhoneType[] = user.phoneNumbers.map((p) => {
      return { value: p.phone, state: p.state };
    });
    setMyPhoneNumbers(numbers);
    addDeviceListeners;
  }

  function addDeviceListeners() {
    device.on("ready", function () {
      console.log("ready");
    });

    device.on("error", function (error: any) {});
  }

  async function onCallStarted() {
    if (device) {
      const call = device.connect({
        To: toNumber,
        AgentNumber: selectedNumber as string,
      });

      // "accepted" means the call has finished connecting and the state is now "open"
      // call.on("accept", updateUIAcceptedOutgoingCall);
      call.on("disconnect", onOutGoingCallDisconnect);
      // call.on("cancel", updateUIDisconnectedOutgoingCall);
      setOutGoingCall(call);
    } else {
    }
  }

  const onOutGoingCallDisconnect = () => {
    outGoingCall?.disconnect();
    setOutGoingCall(undefined);
  };

  const onClick = (num: string) => {
    setToNumber((state) => (state += num));
    if (toNumber.length > 9) {
      setDisabled(true);
    }
  };

  const onReset = () => {
    setToNumber("");
    setDisabled(false);
  };

  useEffect(() => {
    if (toNumber.length > 9) {
      setDisabled(true);
    }
  }, [toNumber.length]);

  useEffect(() => {
    startupClient();
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col gap-2 p-4">hello</div>
      <div className="flex flex-col gap-2 p-4">
        {leadFullName}
        <div className="relative">
          <Input placeholder="Phone Number" value={toNumber} />
          <X
            className="h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer"
            onClick={onReset}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="w-40">Caller Id</span>

          <Select
            name="ddlState"
            defaultValue={selectedNumber}
            onValueChange={(e) => setSelectedNumber(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Smart local Id" />
            </SelectTrigger>
            <SelectContent>
              {myPhoneNumbers.map((phone) => (
                <SelectItem key={phone.value} value={phone.value}>
                  {phone.value} | {phone.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4" /> Call recording
          </div>
          <div className="flex gap-2">
            Off <Switch /> On
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 text-sm">
            <AlertCircle className="h-4 w-4" /> Agent coaching
          </div>
          <div className="flex gap-2">
            Off <Switch /> On
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {numbers.map((number) => (
            <Button
              key={number.value}
              disabled={disabled}
              className="flex-col gap-1 h-14"
              variant="outlineprimary"
              onClick={() => onClick(number.value)}
            >
              <p>{number.value}</p>
              <p>{number.letters}</p>
            </Button>
          ))}
        </div>
        {!outGoingCall ? (
          <Button disabled={!disabled} onClick={onCallStarted}>
            <Phone className="h-4 w-4 mr-2" /> Call
          </Button>
        ) : (
          <Button variant="destructive" onClick={onOutGoingCallDisconnect}>
            <Phone className="h-4 w-4 mr-2" /> Hang up
          </Button>
        )}
      </div>
      {/* {inCommingCall && (
        <div className="flex justify-between items-center">
          <Button disabled={!disabled} onClick={onIncomingCallAccept}>
            <Phone className="h-4 w-4 mr-2" /> Call
          </Button>
          <Button variant="destructive" onClick={onIncomingCallReject}>
            <Phone className="h-4 w-4 mr-2" /> Cancel
          </Button>
        </div>
      )} */}
    </div>
  );
};
