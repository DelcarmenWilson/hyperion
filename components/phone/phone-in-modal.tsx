"use client";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { DialogHp } from "../custom/dialog-hp";
import { PhoneIn } from "./phone-in";

export const PhoneInModal = () => {
  const { isPhoneInOpen } = usePhoneModal();
  return (
    <DialogHp isOpen={isPhoneInOpen}>
      <PhoneIn />
    </DialogHp>
  );
};
