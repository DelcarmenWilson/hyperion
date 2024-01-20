"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  DollarSign,
  Globe2,
  Home,
  LineChart,
  Mail,
  MessageSquare,
  MessagesSquare,
  Phone,
  Settings,
  UserSquare,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IconLink } from "./icon-link";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";

export const MainSideBar = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: Home,
    },
    {
      title: "Leads",
      href: "/leads",
      active: pathname === "/leads",
      icon: Users,
    },
    {
      title: "Inbox",
      href: "/inbox",
      active: pathname === "/inbox",
      icon: MessagesSquare,
    },
    {
      title: "Sales Pipeline",
      href: "/sales",
      active: pathname === "/sales",
      icon: UserSquare,
    },
    {
      title: "Reports",
      href: "/reports",
      active: pathname === "/reports",
      icon: LineChart,
    },
    {
      title: "Campaigns",
      href: "/campaigns",
      active: pathname === "/campaigns",
      icon: Globe2,
    },
    {
      title: "Phone Setup",
      href: "/phone",
      active: pathname === "/phone",
      icon: Phone,
    },
    {
      title: "Lead Vendors",
      href: "/vendors",
      active: pathname === "/vendors",
      icon: ClipboardList,
    },

    {
      title: "Marketing",
      href: "/marketing",
      active: pathname === "/marketing",
      icon: ClipboardList,
    },
    {
      title: "Sms",
      href: "/sms",
      active: pathname === "/sms",
      icon: MessageSquare,
    },
    {
      title: "Email",
      href: "/email",
      active: pathname === "/email",
      icon: Mail,
    },
    {
      title: "Account settings",
      href: "/settings",
      active: pathname === "/settings",
      icon: Settings,
    },
    {
      title: "Billing",
      href: "/billing",
      active: pathname === "/billing",
      icon: DollarSign,
    },
  ];
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
          src="/logo2.png"
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
            active={route.active}
            icon={route.icon}
          />
        ))}
      </ScrollArea>
    </aside>
  );
};
