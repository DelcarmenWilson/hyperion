"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { UserButton } from "@/components/auth/user-button";
import { AdminSidebarRoutes } from "@/constants/page-routes";
import { useSidebar } from "@/store/use-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconLink } from "@/components/reusable/icon-link";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCurrentRole } from "@/hooks/user-current-role";

export const AdminSidebar = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
  const pathname = usePathname();
  const router = useRouter();
  const role = useCurrentRole();
  const routes =
    role == "MASTER"
      ? AdminSidebarRoutes
      : AdminSidebarRoutes.filter((e) => !e.master);

  return (
    <aside
      onMouseOver={onExpand}
      onMouseLeave={onCollapse}
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-background border-r z-50 py-2 transition ease-in-out",
        collapsed && "w-[70px]"
      )}
      // className={cn(
      //   "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50 py-2 transition-opacity opacity-15 ease-out delay-75 hover:opacity-100",
      //   collapsed && "w-[70px]"
      // )}
    >
      <div
        className="flex items-center justify-center gap-2 p-2 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <Image
          src="/logo3.png"
          alt="logo"
          width="40"
          height="40"
          className="w-[40px] aspect-square"
        />
        {!collapsed && (
          <span className="transition font-semibold text-2xl delay-1000">
            Hyperion
          </span>
        )}
      </div>
      <Separator />

      <ScrollArea className="p-2 flex-1">
        {routes.map((route) => (
          <IconLink
            key={route.href}
            title={route.title}
            href={route.href}
            active={pathname === route.href}
            icon={route.icon!}
          />
        ))}
      </ScrollArea>
      <div className="flex flex-col mt-auto items-center space-y-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </aside>
  );
};
