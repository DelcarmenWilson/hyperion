"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Connection, Device } from "twilio-client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AlertCircle, Phone, X } from "lucide-react";
import { Switch } from "../ui/switch";
import { numbers } from "@/constants/phone-numbers";
import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";

interface DialerProps {
  lead?: LeadColumn;
}
export const Dialer = ({ lead }: DialerProps) => {
  const leadFullName = `${lead?.firstName} ${lead?.lastName}`;
  const [disabled, setDisabled] = useState(false);
  // PHONE VARIABLES
  const [device, setDevice] = useState<Device>();
  const [phoneNumber, setPhoneNumber] = useState(lead?.cellPhone || "");
  const [call, setCall] = useState<Connection>();

  async function startupClient() {
    try {
      const response = await axios.get("/api/token");
      const data = response.data;
      intitializeDevice(data.token);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  function intitializeDevice(token: string) {
    // logDiv.classList.remove("hide");
    const device = new Device(token, {
      logLevel: 1,
    });
    addDeviceListeners(device);
    setDevice(device);
  }

  function addDeviceListeners(device: Device) {
    device.on("ready", function () {
      // callControlsDiv.classList.remove("hide");
    });

    device.on("error", function (error: any) {});

    // device.on("incoming", handleIncomingCall);

    // device.audio.on("deviceChange", updateAllAudioDevices.bind(device));

    // Show audio selection UI if it is supported by the browser.
    // if (device.audio.isOutputSelectionSupported) {
    //   audioSelectionDiv.classList.remove("hide");
    // }
  }

  async function onCallStarted() {
    if (device) {
      const call = await device.connect({ To: phoneNumber });

      // "accepted" means the call has finished connecting and the state is now "open"
      // call.on("accept", updateUIAcceptedOutgoingCall);
      // call.on("disconnect", updateUIDisconnectedOutgoingCall);
      // call.on("cancel", updateUIDisconnectedOutgoingCall);
      setCall(call);
      // outgoingCallHangupButton.onclick = () => {
      //   log("Hanging up ...");
      //   call.disconnect();
      // };
    } else {
    }
  }

  const onCallDisconnect = () => {
    call?.disconnect();
    setCall(undefined);
  };

  const onClick = (num: string) => {
    setPhoneNumber((state) => (state += num));
    if (phoneNumber.length > 9) {
      setDisabled(true);
    }
  };
  const onReset = () => {
    setPhoneNumber("");
    setDisabled(false);
  };
  useEffect(() => {
    if (phoneNumber.length > 9) {
      setDisabled(true);
    }
    startupClient();
  }, [phoneNumber]);
  return (
    <div className="flex">
      <div className="flex flex-col gap-2 p-4">hello</div>
      <div className="flex flex-col gap-2 p-4">
        {leadFullName}
        <div className="relative">
          <Input placeholder="Phone Number" value={phoneNumber} />
          <X
            className="h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer"
            onClick={onReset}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="w-40">Caller Id</span>
          <Input placeholder="Smart local Id" />
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
