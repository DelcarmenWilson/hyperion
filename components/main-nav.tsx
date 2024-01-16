"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: "/leads",
      label: "Leads",
      active: pathname === "/leads",
    },
    {
      href: "/csv",
      label: "Csv",
      active: pathname === "/csv",
    },
    {
      href: "/twilio",
      label: "Twilio",
      active: pathname === "/twilio",
    },
    {
      href: "/conversations",
      label: "Conversations",
      active: pathname === "/conversations",
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
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
