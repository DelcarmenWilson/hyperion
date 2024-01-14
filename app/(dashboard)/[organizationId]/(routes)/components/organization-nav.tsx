"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <nav className={cn("flex flex-col mt-2 space-y-2 lg:space-y-4", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
