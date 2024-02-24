"use client";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { DialogHp } from "../custom/dialog-hp";
import { PhoneIn } from "./phone-in";

export const PhoneInModal = () => {
  const { isPhoneInOpen: isOpen } = usePhoneModal();
  return (
    <DialogHp isOpen={isOpen}>
      <PhoneIn />
    </DialogHp>
  );
};
