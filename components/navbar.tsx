"use client";
import { Button } from "./ui/button";
import { Smartphone } from "lucide-react";
import { useDialerModal } from "@/hooks/use-dialer-modal";

const NavBar = () => {
  const useDialer = useDialerModal();
  return (
    <div className=" flex items-center  sticky w-full top-0 z-10 py-2 px-4">
      <div>{/* <MainNav className="mx-6" /> */}</div>
      <div className="ml-auto flex items-center space-x-4">
        <Button
          className="rounded-full"
          size="icon"
          onClick={() => useDialer.onOpen()}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
