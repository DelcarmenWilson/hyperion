"use client";
import { cn } from "@/lib/utils";
import { MessageSquareDot, MessageSquarePlus, Smartphone } from "lucide-react";
import Link from "next/link";

import { usePhone } from "@/hooks/use-phone";
import { Button } from "@/components/ui/button";

import { MainNav } from "./main-nav";
import { MasterSwitch } from "./master-switch";
import { NavChat } from "./nav-chat";
import { NavMessages } from "./nav-messages";
import { useChat } from "@/hooks/use-chat";
import { useCurrentUser } from "@/hooks/use-current-user";

const NavBar = ({ showPhone = true }: { showPhone?: boolean }) => {
  const user = useCurrentUser();
  const { onPhoneOutOpen, isOnCall, lead } = usePhone();
  const { isChatOpen, onChatOpen } = useChat();

  return (
    // <header className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="fixed z-[20] md:left-[180px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center  h-14 max-w-screen-2xl  px-3">
      <MainNav />

      {showPhone && (
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* messages list */}
          <NavMessages />
          {/*srini- Agent chat */}
          <NavChat />
          {/* srini- online chat button */}
          {user?.role == "ADMIN" && (
            <Button
              variant={isChatOpen ? "default" : "outline"}
              size="icon"
              onClick={onChatOpen}
            >
              <MessageSquareDot size={15} />
            </Button>
          )}

          <MasterSwitch />
          <Button asChild>
            <Link
              className="flex items-center justify-center gap-2"
              href="/feedback"
            >
              <MessageSquarePlus size={16} />
              Feedback
            </Link>
          </Button>
          <Button
            variant={isOnCall ? "blue" : "default"}
            className={cn("rounded-full", isOnCall && "animate-ping")}
            size="icon"
            onClick={() => onPhoneOutOpen(isOnCall ? lead : undefined)}
          >
            <Smartphone size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
