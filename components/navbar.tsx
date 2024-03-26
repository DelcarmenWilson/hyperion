"use client";
import { MessageSquarePlus, Smartphone } from "lucide-react";

import { usePhoneModal } from "@/hooks/use-phone-modal";
import { Button } from "./ui/button";
import Link from "next/link";
import { MainNav } from "./main-nav";

const NavBar = () => {
  const usePm = usePhoneModal();
  return (
    <div className="flex items-center sticky w-full top-0 z-10 py-2 px-4">
      <div>{/* <MainNav /> */}</div>
      <div className="ml-auto flex items-center space-x-4">
        <Button asChild>
          <Link
            className="flex items-center justify-center gap-2"
            href="/feedback"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Feedback
          </Link>
        </Button>
        <Button
          className="rounded-full"
          size="icon"
          onClick={() => usePm.onPhoneOutOpen()}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
