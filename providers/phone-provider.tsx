"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Device } from "twilio-client";
import { PhoneOutModal } from "@/components/phone/phone-out-modal";
import { PhoneInModal } from "@/components/phone/phone-in-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Voicemail } from "@/types/phone";
import { LeadStatus } from "@prisma/client";

type PhoneContextProviderProps = {
  children: React.ReactNode;
};

type PhoneContext = {
  phone: Device;
  setPhone: React.Dispatch<React.SetStateAction<Device>>;
  voicemails: Voicemail[] | null;
  setVoicemails: React.Dispatch<React.SetStateAction<Voicemail[] | null>>;
  leadStatus: LeadStatus[] | null;
  setLeadStatus: React.Dispatch<React.SetStateAction<LeadStatus[] | null>>;
};

export const PhoneContext = createContext<PhoneContext | null>(null);

export default function PhoneContextProvider({
  children,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device>(new Device());
  const [voicemails, setVoicemails] = useState<Voicemail[] | null>(null);
  const [leadStatus, setLeadStatus] = useState<LeadStatus[] | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.phoneNumbers.length) return;
    axios.post("/api/token", { identity: user?.id }).then((response) => {
      const data = response.data;
      phone.setup(data.token);
    });
    axios.post("/api/user/voicemails", { user: user?.id }).then((response) => {
      setVoicemails(response.data);
    });
    axios.post("/api/user/leadstatus", { user: user?.id }).then((response) => {
      setLeadStatus(response.data);
    });
  }, []);

  return (
    <PhoneContext.Provider
      value={{
        phone,
        setPhone,
        voicemails,
        setVoicemails,
        leadStatus,
        setLeadStatus,
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
