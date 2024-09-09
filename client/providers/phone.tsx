"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { PhoneOutModal } from "@/components/phone/out-modal";
import { PhoneInModal } from "@/components/phone/in-modal";
import { PhoneDialerModal } from "@/components/phone/dialer/modal";
import { FullCall } from "@/types";
import { CallModal } from "@/components/phone/call-modal";

type PhoneContextProviderProps = {
  token: string;
  initVoicemails: FullCall[] | null;
  children: React.ReactNode;
};

type PhoneContext = {
  phone: Device | null;
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
  const [voicemails, setVoicemails] = useState<FullCall[] | null>(
    initVoicemails
  );

  useEffect(() => {
    const startUp = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const phone = new Device(token);
      phone.register();

      phone.on("registered", () => {
        console.log("Phone is Ready");
      });

      phone.on("error", (error, call) => {
        console.log("An error has occurred: ", error, call);
      });

      setPhone(phone);
    };

    startUp();
  }, []);
  return (
    <PhoneContext.Provider
      value={{
        phone,
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
