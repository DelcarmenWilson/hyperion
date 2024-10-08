"use client";

import React, { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/user-current-role";

import { UserRole } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";

import { AdminRoutes, DashboardRoutes } from "@/constants/page-routes";
import { UserButton } from "@/components/auth/user-button";
import { IconLink } from "@/components/reusable/icon-link";
import { Button } from "../ui/button";

type Props = {
  defaultOpen?: boolean;
  main?: boolean;
};

const MenuOptions = ({ main = false, defaultOpen }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const role = useCurrentRole();
  const pathname = usePathname();
  const allRoutes = main ? DashboardRoutes : AdminRoutes;
  let routes = allRoutes.filter((e) => !e.roles.includes(role as UserRole));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <Sheet modal={false} open={defaultOpen}>
      <SheetContent
        showX={!defaultOpen}
        side={"left"}
        className={cn(
          "flex flex-col h-full bg-background/80 backdrop-blur-xl fixed top-0 border-0 px-2 pb-2 pt-0",
          {
            "hidden md:inline-block z-0 w-[180px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <SheetHeader>
          <SheetDescription />
        </SheetHeader>
        <div className="flex flex-col h-full flex-1">
          <a className="flex h-14 gap-2 items-center" href="/">
            <Image
              src="/logo3.png"
              alt="hyperion logo"
              width={30}
              height={30}
              className="w-[30px] aspect-square"
              priority={false}
              loading="lazy"
            />
            <span className="hidden font-bold sm:inline-block">Hyperion</span>
          </a>

          {/* <Separator className="my-2" /> */}
          <nav className="flex-1">
            {routes.map((route) => {
              const Icon = route.icon!;
              return (
                <Button
                  key={route.href}
                  asChild
                  className="!justify-start mb-1"
                  variant={
                    pathname.includes(route.href) ? "sidebaractive" : "sidebar"
                  }
                >
                  <Link
                    href={route.href}
                    className="group flex items-center gap-2 rounded-md transition-all md:w-full w-[300px]"
                  >
                    <Icon size={16} className="group-hover:animate-spin" />
                    <span>{route.title}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
          <div className="flex flex-col mt-auto items-center space-y-2">
            <IconLink
              title="UPDATES"
              href="/update-page"
              active={pathname.includes("update-page")}
              icon={Sparkle}
            />
            <UserButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
