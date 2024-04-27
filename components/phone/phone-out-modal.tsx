"use client";

import { usePhone } from "@/hooks/use-phone";
import { DrawerRight } from "../custom/drawer-right";
import PhoneShell from "@/components/phone/addins/shell";

export const PhoneOutModal = () => {
  const { isPhoneOutOpen: isDialerOpen, onPhoneOutClose: onDialerClose } =
    usePhone();
  return (
    <DrawerRight
      title="Dialer"
      isOpen={isDialerOpen}
      onClose={onDialerClose}
      scroll={false}
      size="w-auto"
    >
      <PhoneShell />
    </DrawerRight>
  );
};
