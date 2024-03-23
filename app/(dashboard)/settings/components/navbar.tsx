"use client";
import Link from "next/link";
import { useCurrentRole } from "@/hooks/user-current-role";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SettingsNavbarRoutes } from "@/constants/page-routes";

export const NavBar = () => {
  const role = useCurrentRole();
  const pathname = usePathname();
  const allRoutes = SettingsNavbarRoutes.map((route) => {
    route.active = pathname === route.href;
    return route;
  });
  let routes = allRoutes;
  if (role == "ASSISTANT") {
    routes = allRoutes.filter((e) => e.assistant);
  }
  return (
    <div className="flex flex-1 flex-wrap justify-center items-center gap-2">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}>
          <Button variant={route.active ? "default" : "ghost"} size="sm">
            {route.title}
          </Button>
        </Link>
      ))}
    </div>
  );
};
