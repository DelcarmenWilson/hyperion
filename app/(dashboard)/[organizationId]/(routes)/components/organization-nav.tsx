"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { activitiesUrl } from "twilio/lib/jwt/taskrouter/util";

export function OrganizationNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.organizationId}`,
      label: "Overview",
      active: pathname === `/${params.organizationId}`,
    },
    {
      href: `/${params.organizationId}/teams`,
      label: "Teams",
      active: pathname === `/${params.organizationId}/teams`,
    },
    {
      href: `/${params.organizationId}/settings`,
      label: "Settings",
      active: pathname === `/${params.organizationId}/settings`,
    },
  ];
  return (
    <NavigationMenu className="pt-4 max-w-full">
      <NavigationMenuList className="flex flex-col w-full">
        {routes.map((route) => (
          <NavigationMenuItem key={route.href}>
            <Link href={route.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "mb-2",
                  route.active
                    ? "text-black dark:text-white bg-accent"
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
