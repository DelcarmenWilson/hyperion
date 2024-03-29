"use client";

import { usePhoneModal } from "@/hooks/use-phone-modal";
import { DrawerRight } from "../custom/drawer-right";
import PhoneShell from "@/components/phone/addins/shell";

export const PhoneOutModal = () => {
  const { isPhoneOutOpen: isDialerOpen, onPhoneOutClose: onDialerClose } =
    usePhoneModal();
  return (
    <DrawerRight
      title="Dialer"
      isOpen={isDialerOpen}
      onClose={onDialerClose}
      size="w-auto"
    >
      <PhoneShell />
    </DrawerRight>
  );
};
