"use client";
import { usePhoneModal } from "@/hooks/use-phone-modal";
import { DialogHp } from "@/components/custom/dialog-hp";
import { PhoneIn } from "@/components/phone/phone-in";

export const PhoneInModal = () => {
  const pm = usePhoneModal();

  return (
    <DialogHp isOpen={pm.isPhoneInOpen}>
      <PhoneIn />
    </DialogHp>
  );
};
