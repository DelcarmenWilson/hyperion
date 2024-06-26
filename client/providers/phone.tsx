"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Connection, Device } from "twilio-client";
import { PhoneOutModal } from "@/components/phone/phone-out-modal";
import { PhoneInModal } from "@/components/phone/phone-in-modal";
import { PhoneDialerModal } from "@/components/phone/dialer/modal";
import { FullCall } from "@/types";
import { CallModal } from "@/components/phone/call-modal";
import axios from "axios";

type PhoneContextProviderProps = {
  token: string;
  initVoicemails: FullCall[] | null;
  children: React.ReactNode;
};

type PhoneContext = {
  phone: Device | null;
  setPhone: React.Dispatch<React.SetStateAction<Device | null>>;
  call: Connection | null;
  setCall: React.Dispatch<React.SetStateAction<Connection | null>>;
  voicemails: FullCall[] | null;
  setVoicemails: React.Dispatch<React.SetStateAction<FullCall[] | null>>;
};

export const PhoneContext = createContext<PhoneContext | null>(null);

export default function PhoneContextProvider({
  token,
  initVoicemails,
  children,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device | null>(null);
  const [call, setCall] = useState<Connection | null>(null);
  const [voicemails, setVoicemails] = useState<FullCall[] | null>(
    initVoicemails
  );

  useEffect(() => {
    // const getToken = async () => {
    //   const reponse = await axios.post("/api/twilio/token");
    //   return reponse.data;
    // };

    const startUp = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // const timeToLive = 600000; // 10 minutes
      // const timeToLive = 15000;
      // const refreshBuffer = 10000; // 30 seconds
      // const tk = await getToken();

      const phone = new Device(token);

      // _device.on("tokenWillExpire", async () => {
      //   const tk = await getToken();
      //   console.log("Token update");
      //   console.log(tk);
      //   phone?.updateToken(tk);
      // });

      phone.on("ready", function () {
        console.log("ready");
      });

      phone.on("error", function (error: any) {
        console.log(error);
      });

      setPhone(phone);

      // setInterval(async () => {
      //   const tk = await getToken();
      //   phone.updateToken(tk);
      //   console.log("token updated");
      // }, timeToLive - refreshBuffer);
    };

    startUp();
  }, []);
  return (
    <PhoneContext.Provider
      value={{
        phone,
        setPhone,
        call,
        setCall,
        voicemails,
        setVoicemails,
      }}
    >
      {children}
      <PhoneOutModal />
      <PhoneInModal />
      <PhoneDialerModal />
      <CallModal />
    </PhoneContext.Provider>
  );
}

export function usePhoneContext() {
  const context = useContext(PhoneContext);
  if (!context) {
    throw new Error(
      "usePhoneContext must be used withing PhoneContextProvider"
    );
  }

  return context;
}
