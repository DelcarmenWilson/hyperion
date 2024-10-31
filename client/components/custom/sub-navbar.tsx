"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/user-current-role";

import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { NavType } from "@/constants/page-routes";

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
  const routes = allRoutes.filter((e) => e.roles.includes(role as UserRole));

  return (
    <div className="flex flex-1 flex-col lg:flex-row  justify-center items-end lg:items-center gap-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          size="sm"
          asChild
        >
          <Link href={route.href}>{route.title}</Link>
        </Button>
      ))}
    </div>
  );
};
