"use client";

import { usePhone } from "@/hooks/use-phone";
import { DrawerRight } from "../custom/drawer-right";
import PhoneShell from "@/components/phone/addins/shell";
import { PhoneDrawer } from "./phone-drawer";

export const PhoneOutModal = () => {
  const { isPhoneOutOpen, onPhoneOutClose } = usePhone();
  return (
    // <DrawerRight
    //   title="Phone"
    //   isOpen={isDialerOpen}
    //   onClose={onDialerClose}
    //   scroll={false}
    //   size="w-auto"
    // >
    //   <PhoneShell />
    // </DrawerRight>
    <PhoneDrawer
      title="Phone"
      isOpen={isPhoneOutOpen}
      onClose={onPhoneOutClose}
      scroll={false}
      size="w-auto"
    >
      <PhoneShell />
    </PhoneDrawer>
  );
};
