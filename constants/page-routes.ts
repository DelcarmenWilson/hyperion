import {
  ClipboardList,
  Computer,
  DollarSign,
  Globe2,
  Home,
  LineChart,
  LucideIcon,
  Mail,
  MessageSquare,
  MessagesSquare,
  Phone,
  Settings,
  UserSquare,
  Users,
} from "lucide-react";
type MainNavType = {
  title: string;
  href: string;
  active?: boolean;
  icon: LucideIcon;
};
export const MainSidebarRoutes: MainNavType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Inbox",
    href: "/inbox",
    icon: MessagesSquare,
  },
  {
    title: "Sales Pipeline",
    href: "/sales",
    icon: UserSquare,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: LineChart,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Globe2,
  },
  {
    title: "Phone Setup",
    href: "/phone",
    icon: Phone,
  },
  {
    title: "Lead Vendors",
    href: "/vendors",
    icon: ClipboardList,
  },

  {
    title: "Marketing",
    href: "/marketing",
    icon: Computer,
  },
  {
    title: "Sms",
    href: "/sms",
    icon: MessageSquare,
  },
  {
    title: "Email",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Account settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: DollarSign,
  },
];
