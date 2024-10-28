"use client";
import { usePhoneStore } from "@/hooks/use-phone";
import { DrawerExtended } from "@/components/custom/drawer/extended";
import PhoneShell from "@/components/phone/addins/shell";
import { PhoneLeadInfo } from "./addins/lead-info";

export const PhoneOutModal = () => {
  const { isPhoneOutOpen, onPhoneOutClose, isLeadInfoOpen } = usePhoneStore();
  return (
    <DrawerExtended
      title="Phone"
      isOpen={isPhoneOutOpen}
      onClose={onPhoneOutClose}
      sideDrawer={<PhoneLeadInfo />}
      sideDrawerOpen={isLeadInfoOpen}
      scroll={false}
      size="w-auto"
    >
      <PhoneShell />
    </DrawerExtended>
  );
};
