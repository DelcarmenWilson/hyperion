"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createPubSub } from "@/lib/subscribable-function";
// import { usePhoneModal } from "@/hooks/use-phone-modal";

export const MainNav = () => {
  // const usePm = usePhoneModal();
  const pub = createPubSub<{ TestingPubSub: (email: any) => void }>();

  return (
    <div>
      <Image
        src="/logo3.png"
        alt="logo"
        width="40"
        height="40"
        className="w-[40px] aspect-square hover:animate-spin"
      />
      {/* <Button onClick={usePm.onPhoneInOpen}>Open Modal</Button> */}
      <Button onClick={pub.showEvents}>Open Modal</Button>
    </div>
  );
};
