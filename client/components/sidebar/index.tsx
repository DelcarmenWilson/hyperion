"use client";

import React, { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/user/use-current";

import { UserRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { IconLink } from "@/components/reusable/icon-link";
import { UserButton } from "@/components/auth/user-button";
import { AdminRoutes, DashboardRoutes } from "@/constants/page-routes";

type Props = {
  main?: boolean;
};

const Sidebar = ({ main = false }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const role = useCurrentRole();
  const pathname = usePathname();
  const allRoutes = main ? DashboardRoutes : AdminRoutes;
  const routes = allRoutes.filter((e) => e.roles.includes(role as UserRole));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <aside className="flex-center flex-col h-full bg-background/80 pb-2 overflow-hidden shrink-0">
      <nav className="flex flex-col flex-1  items-center  overflow-hidden ">
        <ScrollArea>
          {routes.map((route) => {
            const Icon = route.icon!;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col  items-center gap-1 bg-secondary hover:bg-primary hover:text-white rounded-lg transition-all mb-1 text-center p-2 w-20",
                  pathname.includes(route.href) &&
                    "!bg-primary/80 !text-background"
                )}
              >
                <Icon size={20} />
                <span className="text-[0.6rem] p-0 m-0 -mt-1 leading-3">
                  {route.title}
                </span>
              </Link>
            );
          })}
        </ScrollArea>
      </nav>
      <Separator className="my-1" />
      <div className="flex flex-col mt-auto items-center space-y-2">
        <IconLink
          title="UPDATES"
          href="/update-page"
          active={pathname.includes("update-page")}
          icon={Sparkle}
        />
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
