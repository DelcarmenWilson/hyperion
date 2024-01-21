"use client";

import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { startupClient } from "@/data/actions/twilio";
import axios from "axios";
import { useState } from "react";

export const PhoneClient = () => {
  const [name, setName] = useState("");
  const onStartDevices = async () => {
    await startupClient().then((data) => {
      console.log(data);
      if (data?.success) {
        setName(data.success.identity);
      }
      // if (data?.error) {
      //   toast.error(data?.error);
      // }
    });
  };

  const onStartCall = async () => {
    const call = await axios.post("api/voice/out", { phone: "+13478030962" });
    console.log(call);
  };
  return (
    <div className="text-center">
      <Heading title="Testing Twilio call" description="just a tests" />
      <Button onClick={onStartDevices}>Start Up Device</Button>
      <div className="flex justify-between gap-5">
        <div>
          <h4 className="font-bold">Your Device Info</h4>
          <Separator />
          <p>Your client Name:</p>
          <Input value={name} />

          <p>Rigtone Devices</p>
          <Textarea placeholder="Devices will go here" rows={4} />
          <p>Speaker Devices</p>

          <Textarea placeholder="Devices will go here" rows={4} />
          <Button>Seeing &quot;Unknown&quot; devices</Button>
        </div>
        <div>
          <h4 className="font-bold">Your Device Info</h4>
          <Separator />
          <p>Enter a phone number or client name</p>
          <Input placeholder="+15552221234" />
          <Button onClick={onStartCall}>Call</Button>
        </div>
        <div>
          <h4 className="font-bold">Event Log</h4>
          <Separator />
          <Textarea placeholder="Event Logs will be here" rows={4} />
        </div>
      </div>
    </div>
  );
};
