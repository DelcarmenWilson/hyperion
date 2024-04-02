"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MeetingsNavbarRoutes } from "@/constants/page-routes";

export const NavBar = () => {
  const pathname = usePathname();
  const routes = MeetingsNavbarRoutes.map((route) => {
    route.active = pathname === route.href;
    return route;
  });
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
