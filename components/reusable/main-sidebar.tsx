"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IconLink, IconLinkSkeleton } from "./icon-link";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { MainSidebarRoutes } from "@/constants/page-routes";
// import { ThemeToggle } from "../custom/theme-toggle";
import { UserButton } from "../auth/user-button";
import { Skeleton } from "../ui/skeleton";

export const MainSideBar = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
  const pathname = usePathname();
  const router = useRouter();

  const routes = MainSidebarRoutes.map((route) => {
    route.active = pathname === route.href;
    return route;
  });

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
        onClick={() => router.push("/")}
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
            active={route.active!}
            icon={route.icon!}
          />
        ))}
      </ScrollArea>
      <div className="flex flex-col mt-auto items-center space-y-4">
        {/* <ThemeToggle /> */}
        <UserButton />
      </div>
    </aside>
  );
};

export const MainSidebarSkeleton = () => {
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
