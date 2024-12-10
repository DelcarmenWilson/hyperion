import { useDialerStore } from "@/stores/dialer-store";
import { DrawerRight } from "@/components/custom/drawer/right";
import { SmsClient } from "../sms/client";

export const SmsDrawer = () => {
  const { isSmsFormOpen, onSmsFormToggle } = useDialerStore();
  return (
    <DrawerRight
      title="Sms"
      isOpen={isSmsFormOpen}
      onClose={onSmsFormToggle}
      scroll={false}
    >
      <SmsClient showHeader={false} />
    </DrawerRight>
  );
};
