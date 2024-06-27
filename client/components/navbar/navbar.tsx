"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, MessageSquarePlus, Smartphone } from "lucide-react";
import { useSidebar } from "@/store/use-sidebar";
import Link from "next/link";

import { usePhone } from "@/hooks/use-phone";
import { Button } from "@/components/ui/button";

import { MainNav } from "./main-nav";
import { MasterSwitch } from "./master-switch";
import { NavChat } from "./nav-chat";
import { NavMessages } from "./nav-messages";

const NavBar = ({ showPhone = true }: { showPhone?: boolean }) => {
  const { collapsed, onToggleCollapse } = useSidebar((state) => state);
  const { onPhoneOutOpen, isOnCall, lead } = usePhone();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-2">
        <div className="mr-4 flex gap-2">
          <Button
            variant={collapsed ? "ghost" : "default"}
            size="sm"
            onClick={() => onToggleCollapse(!collapsed)}
          >
            <Menu size={16} className="group-hover:animate-spin" />
          </Button>
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Image
              src="/logo3.png"
              alt="hyperion logo"
              width={30}
              height={30}
              className="w-[30px] aspect-square"
              priority={false}
              loading="lazy"
            />
            <span className="hidden font-bold sm:inline-block">hyperion</span>
          </a>
          <MainNav />
        </div>
        {showPhone && (
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <NavMessages />
            <NavChat />
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
    </header>
  );
};

export default NavBar;
