"use client";
import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SettingsSidebarRoutes } from "@/constants/page-routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const routes = SettingsSidebarRoutes.map((route) => {
    route.active = pathname === route.href;
    return route;
  });
  return (
    <div className="w-[200px] bg-background overflow-y-auto border-r py-2">
      <Heading title="Settings" description="User settings" />
      <Separator />

      <ScrollArea className="p-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={route.active ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start mb-2"
            >
              {route.title}
            </Button>
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
};
