import {
  Calendar,
  ClipboardList,
  Cog,
  Computer,
  ComputerIcon,
  DollarSign,
  Globe2,
  Home,
  Import,
  LineChart,
  Lock,
  LucideIcon,
  Mail,
  MessageSquare,
  MessagesSquare,
  Phone,
  Server,
  Settings,
  ShieldHalf,
  TestTube,
  UserSquare,
  Users,
} from "lucide-react";
type NavType = {
  title: string;
  href: string;
  active?: boolean;
  icon?: LucideIcon;
  master?: boolean;
};

export const AdminSidebarRoutes: NavType[] = [
  { title: "Teams", href: "/admin/teams", icon: ShieldHalf },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Import", href: "/admin/import", icon: Import },
  { title: "Server", href: "/admin/server", icon: Server },
  {
    title: "Client",
    href: "/admin/client",
    icon: ComputerIcon,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Lock,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Cog,
  },
];

export const MainSidebarRoutes: NavType[] = [
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
    href: "/sales-pipeline",
    icon: UserSquare,
  },
  // {
  //   title: "Reports",
  //   href: "/reports",
  //   icon: LineChart,
  // },
  // {
  //   title: "Campaigns",
  //   href: "/campaigns",
  //   icon: Globe2,
  // },
  {
    title: "Phone Setup",
    href: "/phone",
    icon: Phone,
  },
  // {
  //   title: "Lead Vendors",
  //   href: "/vendors",
  //   icon: ClipboardList,
  // },

  // {
  //   title: "Marketing",
  //   href: "/marketing",
  //   icon: Computer,
  // },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Sms",
    href: "/sms",
    icon: MessageSquare,
  },
  // {
  //   title: "Email",
  //   href: "/email",
  //   icon: Mail,
  // },
  {
    title: "Account settings",
    href: "/settings",
    icon: Settings,
  },
  // {
  //   title: "Billing",
  //   href: "/billing",
  //   icon: DollarSign,
  // },
  {
    title: "Test",
    href: "/test",
    icon: TestTube,
  },
];

export const SettingsNavbarRoutes: NavType[] = [
  { title: "Profile", href: "/settings" },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Chat",
    href: "/settings/chat",
  },
  {
    title: "Availability",
    href: "/settings/availability",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Display",
    href: "/settings/display",
  },
];
