"use client";
import { createContext, useContext, useState } from "react";
import { Connection, Device } from "twilio-client";
import { PhoneOutModal } from "@/components/phone/phone-out-modal";
import { PhoneInModal } from "@/components/phone/phone-in-modal";
import { Voicemail } from "@/types/phone";

type PhoneContextProviderProps = {
  token: string;
  initVoicemails: Voicemail[] | null;
  children: React.ReactNode;
};

type PhoneContext = {
  phone: Device;
  setPhone: React.Dispatch<React.SetStateAction<Device>>;
  call: Connection | null;
  setCall: React.Dispatch<React.SetStateAction<Connection | null>>;
  voicemails: Voicemail[] | null;
  setVoicemails: React.Dispatch<React.SetStateAction<Voicemail[] | null>>;
};

export const PhoneContext = createContext<PhoneContext | null>(null);

export default function PhoneContextProvider({
  token,
  initVoicemails,
  children,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device>(new Device(token));
  const [call, setCall] = useState<Connection | null>(null);
  const [voicemails, setVoicemails] = useState<Voicemail[] | null>(
    initVoicemails
  );

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
