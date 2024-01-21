"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IconLink } from "./icon-link";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { MainSidebarRoutes } from "@/constants/page-routes";

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
    </aside>
  );
};
