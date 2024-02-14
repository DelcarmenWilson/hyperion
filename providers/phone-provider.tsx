"use client";
import { DialerModal } from "@/components/modals/dialer-modal";
import { PhoneModal } from "@/components/modals/phone-modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Device } from "twilio-client";

type PhoneContextProviderProps = {
  children: React.ReactNode;
};
type PhoneContext = {
  phone: Device;
  setPhone: React.Dispatch<React.SetStateAction<Device>>;
};

export const PhoneContext = createContext<PhoneContext | null>(null);
export default function PhoneContextProvider({
  children,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device>(new Device());
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.phoneNumbers.length) return;
    axios.post("/api/token", { identity: user?.id }).then((response) => {
      const data = response.data;
      phone.setup(data.token);
    });
  }, []);

  return (
    <PhoneContext.Provider value={{ phone, setPhone }}>
      {children}
      <DialerModal />
      <PhoneModal />
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
