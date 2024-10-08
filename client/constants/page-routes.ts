import { UserRole } from "@prisma/client";
import {
  Backpack,
  Bot,
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

export type NavType = {
  title: string;
  href: string;
  active?: boolean;
  icon?: LucideIcon;
  roles: UserRole[];
};
const allAdmins: UserRole[] = ["MASTER", "ADMIN", "SUPER_ADMIN"];
const upperAdmins: UserRole[] = ["MASTER", "SUPER_ADMIN"];
const allUsers: UserRole[] = [
  "MASTER",
  "ADMIN",
  "SUPER_ADMIN",
  "ASSISTANT",
  "USER",
];
const allAgents: UserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"];

export const AdminRoutes: NavType[] = [
  {
    title: "Organizations",
    href: "/admin/organizations",
    icon: Building,
    roles: ["MASTER"],
  },
  { title: "Teams", href: "/admin/teams", icon: ShieldHalf, roles: allAdmins },
  { title: "Users", href: "/admin/users", icon: Users, roles: allAdmins },
  { title: "Import", href: "/admin/import", icon: Import, roles: ["MASTER"] },
  {
    title: "Feedback",
    href: "/admin/feedback",
    icon: MessageSquarePlus,
    roles: ["MASTER"],
  },
  {
    title: "Misc",
    href: "/admin/misc",
    icon: MilestoneIcon,
    roles: ["MASTER"],
  },
  {
    title: "Phone Setup",
    href: "/admin/phone",
    icon: Phone,
    roles: upperAdmins,
  },
  {
    title: "Page Settings",
    href: "/admin/page-settings",
    icon: Key,
    roles: ["MASTER"],
  },
  {
    title: "Scripts",
    href: "/admin/scripts",
    icon: ScrollText,
    roles: upperAdmins,
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
    roles: upperAdmins,
  },
  {
    title: "Hp Leads",
    href: "/admin/hyperion-leads",
    icon: Heading,
    roles: upperAdmins,
  },
  {
    title: "Tasks",
    href: "/admin/tasks",
    icon: ListTodo,
    roles: upperAdmins,
  },
  {
    title: "WorkFlows",
    href: "/admin/workflows",
    icon: Workflow,
    roles: upperAdmins,
  },
  {
    title: "Chatbot",
    href: "/admin/chatbot",
    icon: TestTube,
    roles: allAdmins,
  },
];

export const DashboardRoutes: NavType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: allUsers,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
    roles: allUsers,
  },
  {
    title: "Conversations",
    href: "/conversations",
    icon: MessagesSquare,
    roles: allUsers,
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
    roles: allUsers,
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
    roles: allAdmins,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: Bot,
    roles: allUsers,
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
    roles: allUsers,
  },
  {
    title: "Meetings",
    href: "/meeting",
    icon: Video,
    roles: allAdmins,
  },
  {
    title: "Sms",
    href: "/sms",
    icon: MessageSquare,
    roles: allAgents,
  },
  {
    title: "Blue Print",
    href: "/blueprint",
    icon: GoalIcon,
    roles: allAgents,
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
    roles: allAdmins,
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
  { title: "Home", href: "/meeting", roles: allUsers },
  {
    title: "Upcoming",
    href: "/meeting/upcoming",
    roles: allAgents,
  },
  {
    title: "Previous",
    href: "/meeting/previous",
    roles: allAgents,
  },
  {
    title: "Recordings",
    href: "/meeting/recordings",
    roles: allAgents,
  },
  {
    title: "Personal Room",
    href: "/meeting/personal-room",
    roles: allAgents,
  },
];

export const SettingsRoutes: NavType[] = [
  { title: "Profile", href: "/settings", roles: allUsers },
  {
    title: "Config",
    href: "/settings/config",
    roles: allUsers,
  },
  {
    title: "Phone",
    href: "/settings/phone",
    roles: allAgents,
  },
  {
    title: "Chat",
    href: "/settings/titan",
    roles: allAgents,
  },
  {
    title: "Availability",
    href: "/settings/availability",
    roles: allAgents,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    roles: allAgents,
  },
  {
    title: "Display",
    href: "/settings/display",
    roles: allUsers,
  },
];
