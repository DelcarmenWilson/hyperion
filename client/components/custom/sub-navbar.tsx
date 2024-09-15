"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { NavType } from "@/constants/page-routes";
import { useCurrentRole } from "@/hooks/user-current-role";

type SubNavBarProps = {
  intialRoutes: NavType[];
};
export const SubNavBar = ({ intialRoutes }: SubNavBarProps) => {
  const role = useCurrentRole();
  const pathname = usePathname();
  const allRoutes = intialRoutes.map((route) => {
    route.active = pathname === route.href;
    return route;
  });
  let routes = allRoutes;
  if (role == "ASSISTANT") {
    routes = allRoutes.filter((e) => e.assistant);
  }
  return (
    <div className="flex flex-1 flex-col lg:flex-row  justify-center items-end lg:items-center gap-2">
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
