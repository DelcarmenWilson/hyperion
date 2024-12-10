"use client";
import { usePhoneStore } from "@/stores/phone-store";
import { useLeadStore } from "@/stores/lead-store";

import { DrawerExtended } from "@/components/custom/drawer/extended";
import PhoneShell from "@/components/phone/addins/shell";
import { PhoneLeadInfo } from "./addins/lead-info";

export const PhoneOutModal = () => {
  const { leadId } = useLeadStore();
  const { isPhoneOutOpen, onPhoneOutClose, isLeadInfoOpen } = usePhoneStore();
  return (
    <DrawerExtended
      title="Phone"
      isOpen={isPhoneOutOpen}
      onClose={onPhoneOutClose}
      sideDrawer={<PhoneLeadInfo leadId={leadId} />}
      sideDrawerOpen={isLeadInfoOpen}
      scroll={false}
      size="w-auto"
    >
      <PhoneShell />
    </DrawerExtended>
  );
};
