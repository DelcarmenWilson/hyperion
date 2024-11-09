import { UserRole } from "@prisma/client";
import {
  Backpack,
  Bot,
  Briefcase,
  Building,
  Calendar,
  GoalIcon,
  Heading,
  Home,
  Import,
  Key,
  ListTodo,
  LucideIcon,
  MessageSquare,
  MessageSquarePlus,
  MessagesSquare,
  MilestoneIcon,
  Phone,
  ScrollText,
  Settings,
  ShieldHalf,
  TestTube,
  ThermometerSun,
  UserSquare,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { ALLADMINS, ALLAGENTS, ALLUSERS, HIGHERADMINS, UPPERADMINS } from "./user";

export type NavType = {
  title: string;
  href: string;
  active?: boolean;
  icon?: LucideIcon;
  roles: UserRole[];
};


export const AdminRoutes: NavType[] = [
  {
    title: "Organizations",
    href: "/admin/organizations",
    icon: Building,
    roles: ["MASTER"],
  },
  { title: "Teams", href: "/admin/teams", icon: ShieldHalf, roles: ALLADMINS },
  { title: "Users", href: "/admin/users", icon: Users, roles: ALLADMINS },
  { title: "Import", href: "/admin/import", icon: Import, roles: ["MASTER"] },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquarePlus,
    roles: HIGHERADMINS,
  },
  {
    title: "Misc",
    href: "/admin/misc",
    icon: MilestoneIcon,
    roles: UPPERADMINS,
  },
  {
    title: "Phone Setup",
    href: "/admin/phone",
    icon: Phone,
    roles: HIGHERADMINS,
  },
  {
    title: "Page Settings",
    href: "/admin/page-settings",
    icon: Key,
    roles: UPPERADMINS,
  },
  {
    title: "Scripts",
    href: "/admin/scripts",
    icon: ScrollText,
    roles: HIGHERADMINS,
  },
  {
    title: "Shad",
    href: "/admin/shadcn",
    icon: ThermometerSun,
    roles: ["MASTER"],
  },
  {
    title: "Test",
    href: "/admin/test",
    icon: TestTube,
    roles: ["MASTER"],
  },
  {
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: Backpack,
    roles: HIGHERADMINS,
  },
  {
    title: "Hp Leads",
    href: "/admin/hyperion-leads",
    icon: Heading,
    roles: HIGHERADMINS,
  },
  {
    title: "Tasks",
    href: "/admin/tasks",
    icon: ListTodo,
    roles: HIGHERADMINS,
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    roles: ["DEVELOPER"],
  },
  // {
  //   title: "WorkFlows",
  //   href: "/admin/workflows",
  //   icon: Workflow,
  //   roles: HIGHERADMINS,
  // },
  {
    title: "Chatbot",
    href: "/admin/chatbot",
    icon: TestTube,
    roles: ALLADMINS,
  },
];

export const DashboardRoutes: NavType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ALLUSERS,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
    roles: ALLUSERS,
  },
  {
    title: "Conversations",
    href: "/conversations",
    icon: MessagesSquare,
    roles: ALLUSERS,
  },
  // {
  //   title: "Inbox",
  //   href: "/inbox",
  //   icon: MessagesSquare,
  // },
  {
    title: "Sales Pipeline",
    href: "/sales-pipeline",
    icon: UserSquare,
    roles: ALLUSERS,
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
    roles: ALLADMINS,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: Bot,
    roles: ALLUSERS,
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
    roles: ALLUSERS,
  },
  {
    title: "Meetings",
    href: "/meeting",
    icon: Video,
    roles: ALLADMINS,
  },
  {
    title: "Sms",
    href: "/sms",
    icon: MessageSquare,
    roles: ALLAGENTS,
  },
  {
    title: "Blue Print",
    href: "/blueprint",
    icon: GoalIcon,
    roles: ALLAGENTS,
  },
  // {
  //   title: "Email",
  //   href: "/email",
  //   icon: Mail,
  // },
  {
    title: "Work Flows",
    href: "/workflows",
    icon: Workflow,
    roles: ALLADMINS,
  },
  // {
  //   title: "Chatbot",
  //   href: "/chatbot",
  //   icon: TestTube,
  // },
  // {
  //   title: "Account settings",
  //   href: "/settings",
  //   icon: Settings,
  //   assistant: true,
  // },
  // {
  //   title: "Billing",
  //   href: "/billing",
  //   icon: DollarSign,
  // },
];

export const MeetingRoutes: NavType[] = [
  { title: "Home", href: "/meeting", roles: ALLUSERS },
  {
    title: "Upcoming",
    href: "/meeting/upcoming",
    roles: ALLAGENTS,
  },
  {
    title: "Previous",
    href: "/meeting/previous",
    roles: ALLAGENTS,
  },
  {
    title: "Recordings",
    href: "/meeting/recordings",
    roles: ALLAGENTS,
  },
  {
    title: "Personal Room",
    href: "/meeting/personal-room",
    roles: ALLAGENTS,
  },
];

export const SettingsRoutes: NavType[] = [
  { title: "Profile", href: "/settings", roles: ALLUSERS },
  {
    title: "Config",
    href: "/settings/config",
    roles: ALLUSERS,
  },
  {
    title: "Phone",
    href: "/settings/phone",
    roles: ALLAGENTS,
  },
  {
    title: "Chat",
    href: "/settings/titan",
    roles: ALLAGENTS,
  },
  {
    title: "Availability",
    href: "/settings/availability",
    roles: ALLAGENTS,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    roles: ALLAGENTS,
  },
  {
    title: "Display",
    href: "/settings/display",
    roles: ALLUSERS,
  },
];
