"use client";

import { useState } from "react";
import axios from "axios";
import { Device } from "twilio-client";

import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type LogType = {
  value: string;
};
export const PhoneClient = () => {
  const [device, setDevice] = useState<Device>();
  const [logs, setLogs] = useState<LogType[]>([]);
  const [name, setName] = useState("");
  const [phoneTo, setPhoneTo] = useState("+13478030962");

  const log = (val: string) => {
    setLogs((l) => [...l, { value: val }]);
  };
  async function startupClient() {
    log("Requesting Access Token...");

    try {
      const response = await axios.get("/api/token");
      const data = response.data;
      log("Got a token.");
      log(data.token);
      log(data.identity);
      setName(data.identity);
      intitializeDevice(data.token);
    } catch (err) {
      console.log(err);
      log("An error occurred. See your browser console for more information.");
    }
  }
  function intitializeDevice(token: string) {
    // logDiv.classList.remove("hide");
    log("Initializing device");
    const device = new Device(token, {
      logLevel: 1,
    });
    addDeviceListeners(device);
    setDevice(device);
  }

  function addDeviceListeners(device: Device) {
    device.on("ready", function () {
      log("Twilio.Device Ready to make and receive calls!");
      // callControlsDiv.classList.remove("hide");
    });

    device.on("error", function (error: any) {
      log("Twilio.Device Error: " + error.message);
    });

    // device.on("incoming", handleIncomingCall);

    // device.audio.on("deviceChange", updateAllAudioDevices.bind(device));

    // Show audio selection UI if it is supported by the browser.
    // if (device.audio.isOutputSelectionSupported) {
    //   audioSelectionDiv.classList.remove("hide");
    // }
  }

  async function makeOutgoingCall() {
    if (device) {
      log(`Attempting to call ${phoneTo} ...`);

      // Twilio.Device.connect() returns a Call object
      const call = await device.connect({ To: phoneTo });

      // add listeners to the Call
      // "accepted" means the call has finished connecting and the state is now "open"
      // call.on("accept", updateUIAcceptedOutgoingCall);
      // call.on("disconnect", updateUIDisconnectedOutgoingCall);
      // call.on("cancel", updateUIDisconnectedOutgoingCall);

      // outgoingCallHangupButton.onclick = () => {
      //   log("Hanging up ...");
      //   call.disconnect();
      // };
    } else {
      log("Unable to make call.");
    }
  }
  return (
    <div className="text-center">
      <Heading title="Testing Twilio call" description="just a tests" />
      <Button onClick={startupClient}>Start Up Device</Button>
      <div className="grid grid-cols-3 gap-5">
        <div>
          <h4 className="font-bold">Your Device Info</h4>
          <Separator />
          <p>Your client Name:</p>
          <Input value={name} />

          <p>Rigtone Devices</p>
          <div className="border min-h-10">RINGTONE DEVICES GO HERE</div>
          <p>Speaker Devices</p>

          <div className="border min-h-10">SPEAKER DEVICES GO HERE</div>
          <Button>Seeing &quot;Unknown&quot; devices</Button>
        </div>
        <div>
          <h4 className="font-bold">Your Device Info</h4>
          <Separator />
          <p>Enter a phone number or client name</p>
          <Input placeholder="+15552221234" />
          <Button onClick={makeOutgoingCall}>Call</Button>
        </div>
        <div>
          <h4 className="font-bold">Event Log</h4>
          <Separator />
          <div className="border min-h-10">
            {logs.map((log) => (
              <p key={log.value}>{log.value}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
