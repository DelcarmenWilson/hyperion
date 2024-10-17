"use client";
import { usePhoneStore } from "@/hooks/use-phone";
import PhoneShell from "@/components/phone/addins/shell";
import { PhoneDrawer } from "./drawer";

export const PhoneOutModal = () => {
  const { isPhoneOutOpen, onPhoneOutClose } = usePhoneStore();
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
