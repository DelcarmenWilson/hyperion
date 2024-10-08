"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/store/use-sidebar";
import { useCurrentRole } from "@/hooks/user-current-role";
import { ArrowRight, Sparkle } from "lucide-react";

import { UserRole } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/components/auth/user-button";
import { Skeleton } from "@/components/ui/skeleton";

import { AdminRoutes, DashboardRoutes } from "@/constants/page-routes";
import { IconLink, IconLinkSkeleton } from "../reusable/icon-link";

export const SideBar = ({ main = false }: { main?: boolean }) => {
  const { isOpen } = useSidebar((state) => state);
  const role = useCurrentRole();
  const pathname = usePathname();
  const allRoutes = main ? DashboardRoutes : AdminRoutes;
  const routes = allRoutes.filter((e) => e.roles.includes(role as UserRole));
  return (
    <aside
      className={cn(
        "flex flex-col fixed top-14 z-30 h-[calc(100vh-3.5rem)] w-60 shrink-0 md:sticky bg-background border-r py-2 transition-[width] ease-in-out",
        isOpen && "w-[70px]"
      )}
    >
      <ScrollArea className="p-2 flex-1">
        {routes.map((route) => (
          <IconLink
            key={route.href}
            title={route.title}
            href={route.href}
            active={pathname.includes(route.href)}
            icon={route.icon!}
          />
        ))}
      </ScrollArea>
      <div className="flex flex-col mt-auto items-center space-y-4">
        <IconLink
          title="updates"
          href="/update-page"
          active={pathname.includes("update-page")}
          icon={Sparkle}
        />
        <UserButton />
      </div>
    </aside>
  );
};

export const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] h-full bg-background border-r z-50 py-2 transition ease-in-out">
      <div className="flex items-center justify-center gap-2 p-2 cursor-pointer">
        <Skeleton className="min-h-[60px] min-w-[60px] " />
        {/* <span className="transition font-semibold text-2xl delay-1000">
          Hyperion
        </span> */}
      </div>
      <Separator />
      <div className="p-2 flex-1">
        {[...Array(5)].map((_, i) => (
          <IconLinkSkeleton key={i} />
        ))}
      </div>

      <div className="flex flex-col mt-auto items-center space-y-4">
        <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
        <Skeleton className="min-h-[32px] min-w-[32px] rounded-full" />
      </div>
    </aside>
  );
};
