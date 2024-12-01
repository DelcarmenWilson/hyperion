"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { PhoneOutModal } from "@/components/phone/out-modal";
import { PhoneInModal } from "@/components/phone/in-modal";
import { PhoneDialerModal } from "@/components/phone/dialer/modal";
import { FullCall } from "@/types";
import { CallModal } from "@/components/phone/details-call-dialog";
import { PhoneSettings } from "@prisma/client";

type PhoneContextProviderProps = {
  token: string;
  initVoicemails: FullCall[] | null;
  children: React.ReactNode;
  settings: PhoneSettings;
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
  settings,
}: PhoneContextProviderProps) {
  const [phone, setPhone] = useState<Device | null>(null);
  const [voicemails, setVoicemails] = useState<FullCall[] | null>(
    initVoicemails
  );

  useEffect(() => {
    const startUp = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const phone = new Device(token, {
        sounds: {
          incoming:
            settings.incoming != "N/A"
              ? `/sounds/ringtone/${settings.incoming}.mp3`
              : undefined,
          outgoing:
            settings.incoming != "N/A"
              ? `/sounds/ringtone/${settings.outgoing}.mp3`
              : undefined,
          dtmf1:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-1.mp3`
              : undefined,
          dtmf2:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-2.mp3`
              : undefined,
          dtmf3:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-3.mp3`
              : undefined,
          dtmf4:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-4.mp3`
              : undefined,
          dtmf5:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-5.mp3`
              : undefined,
          dtmf6:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-6.mp3`
              : undefined,
          dtmf7:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-7.mp3`
              : undefined,
          dtmf8:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-8.mp3`
              : undefined,
          dtmf9:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-9.mp3`
              : undefined,
          dtmf0:
            settings.dtmfPack != "N/A"
              ? `/sounds/dialtone/${settings.dtmfPack}-0.mp3`
              : undefined,
        },
      });
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
