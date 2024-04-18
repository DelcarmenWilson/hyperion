"use client";
import Image from "next/image";
import { MessageSquarePlus, Smartphone } from "lucide-react";

import { usePhoneModal } from "@/hooks/use-phone-modal";
import { Button } from "./ui/button";
import Link from "next/link";
// import { MainNav } from "./main-nav";

const NavBar = () => {
  const usePm = usePhoneModal();
  return (
    <header className="fized top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-2">
        <div className="mr-4 hidden md:flex">
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
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="radix-:R16u6la:"
          data-state="closed"
        >
          <svg
            stroke-width="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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
    </header>
    // <div className="flex items-center sticky w-full top-0 z-10 py-2 px-4">
    // <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    //   <div>{/* <MainNav /> */}</div>
    //   <div className="ml-auto flex items-center space-x-4">
    //     <Button asChild>
    //       <Link
    //         className="flex items-center justify-center gap-2"
    //         href="/feedback"
    //       >
    //         <MessageSquarePlus className="w-4 h-4" />
    //         Feedback
    //       </Link>
    //     </Button>
    //     <Button
    //       className="rounded-full"
    //       size="icon"
    //       onClick={() => usePm.onPhoneOutOpen()}
    //     >
    //       <Smartphone className="w-4 h-4" />
    //     </Button>
    //   </div>
    // </div>
  );
};

export default NavBar;
