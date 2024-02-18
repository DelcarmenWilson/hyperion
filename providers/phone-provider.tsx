"use client";
import { PhoneOutModal } from "@/components/phone/phone-out-modal";
import { PhoneInModal } from "@/components/phone/phone-in-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Device } from "twilio-client";
import { Call } from "@prisma/client";
import { Voicemail } from "@/types";

type PhoneContextProviderProps = {
  children: React.ReactNode;
};

type PhoneContext = {
  phone: Device;
  setPhone: React.Dispatch<React.SetStateAction<Device>>;
  voicemails: Voicemail[] | null;
  setVoicemails: React.Dispatch<React.SetStateAction<Voicemail[] | null>>;
};

export const PhoneContext = createContext<PhoneContext | null>(null);
export default function PhoneContextProvider({
  children,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device>(new Device());
  const [voicemails, setVoicemails] = useState<Voicemail[] | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.phoneNumbers.length) return;
    axios.post("/api/token", { identity: user?.id }).then((response) => {
      const data = response.data;
      phone.setup(data.token);
    });
    axios
      .post("/api/user/voicemails", { identity: user?.id })
      .then((response) => {
        setVoicemails(response.data);
      });
  }, []);

  return (
    <PhoneContext.Provider
      value={{ phone, setPhone, voicemails, setVoicemails }}
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
      "usePhoneContext must be used withing  PhoneContextProvider"
    );
  }

  return context;
}
