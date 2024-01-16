"use client";
import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const routes = [
    { title: "Profile", href: "/settings", active: pathname === "/settings" },
    {
      title: "Account",
      href: "/settings/account",
      active: pathname === "/settings/account",
    },
    {
      title: "Chat",
      href: "/settings/chat",
      active: pathname === "/settings/chat",
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
      active: pathname === "/settings/appearance",
    },
    {
      title: "Notifications",
      href: "/settings/notifications",
      active: pathname === "/settings/notifications",
    },
    {
      title: "Display",
      href: "/settings/display",
      active: pathname === "/settings/display",
    },
  ];
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
