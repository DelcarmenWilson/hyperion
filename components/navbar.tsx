"use client";
import Image from "next/image";
import { Menu, MessageSquarePlus, Smartphone } from "lucide-react";

import { usePhone } from "@/hooks/use-phone";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSidebar } from "@/store/use-sidebar";
// import { MainNav } from "./main-nav";
type NavBarProps = {
  showPhone?: boolean;
};
const NavBar = ({ showPhone = true }: NavBarProps) => {
  const { collapsed, onToggleCollapse } = useSidebar((state) => state);
  const usePm = usePhone();
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
              alt="logo"
              width="30"
              height="30"
              className="w-[30px] aspect-square"
            />
            <span className="hidden font-bold sm:inline-block">hyperion</span>
          </a>
          {/* <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/docs"
            >
              Docs
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/docs/components"
            >
              Components
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/themes"
            >
              Themes
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/examples"
            >
              Examples
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/blocks"
            >
              Blocks
            </a>
            <a
              className="hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
              href="https://github.com/shadcn-ui/ui"
            >
              GitHub
            </a>
          </nav> */}
        </div>

        {showPhone && (
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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
              className="rounded-full"
              size="icon"
              onClick={() => usePm.onPhoneOutOpen()}
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
