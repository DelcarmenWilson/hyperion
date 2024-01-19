"use client";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLink } from "./icon-link";

export const MainSideBar = () => {
  const pathname = usePathname();
  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
      icon: <Home />,
    },
    {
      title: "Leads",
      href: "/leads",
      active: pathname === "/leads",
      icon: <Users />,
    },
    {
      title: "Inbox",
      href: "/inbox",
      active: pathname === "/inbox",
      icon: <MessagesSquare />,
    },
    {
      title: "Sales Pipeline",
      href: "/sales",
      active: pathname === "/sales",
      icon: <UserSquare />,
    },
    {
      title: "Reports",
      href: "/reports",
      active: pathname === "/reports",
      icon: <LineChart />,
    },
    {
      title: "Campaigns",
      href: "/campaigns",
      active: pathname === "/campaigns",
      icon: <Globe2 />,
    },
    {
      title: "Phone Setup",
      href: "/phone",
      active: pathname === "/phone",
      icon: <Phone />,
    },
    {
      title: "Lead Vendors",
      href: "/vendors",
      active: pathname === "/vendors",
      icon: <ClipboardList />,
    },

    {
      title: "Marketing",
      href: "/marketing",
      active: pathname === "/marketing",
      icon: <ClipboardList />,
    },
    {
      title: "Sms",
      href: "/sms",
      active: pathname === "/sms",
      icon: <MessageSquare />,
    },
    {
      title: "Email",
      href: "/email",
      active: pathname === "/email",
      icon: <Mail />,
    },
    {
      title: "Account settings",
      href: "/settings",
      active: pathname === "/settings",
      icon: <Settings />,
    },
    {
      title: "Account settings",
      href: "/settings",
      active: pathname === "/settings",
      icon: <Settings />,
    },
    {
      title: "Billing",
      href: "/billing",
      active: pathname === "/billing",
      icon: <DollarSign />,
    },
  ];
  return (
    <div className="w-[200px] absolute top-0 left-0 h-full z-50 bg-background overflow-y-auto border-r py-2">
      <div className="flex items-center gap-2 p-2">
        <Image
          src="/logo2.png"
          alt="logo"
          width="75"
          height="75"
          className="w-[50px] aspect-square"
        />
        <span className="font-semibold text-2xl">Hyperion</span>
      </div>
      <Separator />

      <ScrollArea className="p-2">
        {routes.map((route) => (
          <IconLink key={route.href} />
          // <Link key={route.href} href={route.href}>
          //   <Button
          //     variant={route.active ? "default" : "ghost"}
          //     size="sm"
          //     className="w-full flex items-center justify-start  mb-2 "
          //   >
          //     <div className="mr-2 h-4 w-4">{route.icon}</div>
          //     <span>{route.title}</span>
          //   </Button>
          // </Link>
        ))}
      </ScrollArea>
    </div>
  );
};
