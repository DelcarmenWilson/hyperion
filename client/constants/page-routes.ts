
import {
  Backpack,
  Bot,
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
  master?: boolean;
  assistant?: boolean;
};

export const AdminSidebarRoutes: NavType[] = [
  { title: "Teams", href: "/admin/teams", icon: ShieldHalf },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Import", href: "/admin/import", icon: Import, master: true },
  { title: "Feedback", href: "/admin/feedback", icon: MessageSquarePlus },
  { title: "Misc", href: "/admin/misc", icon: MilestoneIcon, master: true },
  {
    title: "Phone Setup",
    href: "/admin/phone",
    icon: Phone,
  },
  {
    title: "Page Settings",
    href: "/admin/page-settings",
    icon: Key,
  },
  {
    title: "Scripts",
    href: "/admin/scripts",
    icon: ScrollText,
  },
  {
    title: "Shad",
    href: "/admin/shadcn",
    icon: ThermometerSun,
    master: true,
  },
  {
    title: "Test",
    href: "/admin/test",
    icon: TestTube,
    master: true,
  },{
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: Backpack,
  },
  {
    title: "Hp Leads",
    href: "/admin/hyperion-leads",
    icon: Heading,
  }, {
    title: "Tasks",
    href: "/admin/tasks",
    icon: ListTodo,
  },
  {
    title: "WorkFlows",
    href: "/admin/workflows",
    icon: Workflow,
  },
  {
    title: "Chatbot",
    href: "/admin/chatbot",
    icon: TestTube,
  },
];

export const MainSidebarRoutes: NavType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    assistant: true,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
    assistant: true,
  },
  {
    title: "Conversations",
    href: "/conversations",
    icon: MessagesSquare,
    assistant: true,
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
    assistant: true,
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
  {
    title: "Chat",
    href: "/chat",
    icon: Bot,
    assistant: true,
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
    assistant: true,
  },
  {
    title: "Meetings",
    href: "/meeting",
    icon: Video,
    assistant: true,
  },
  {
    title: "Sms",
    href: "/sms",
    icon: MessageSquare,
  },
  {
    title: "Blue Print",
    href: "/blueprint",
    icon: GoalIcon,
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

export const MeetingsNavbarRoutes: NavType[] = [
  { title: "Home", href: "/meeting", assistant: true },
  {
    title: "Upcoming",
    href: "/meeting/upcoming",
  },
  {
    title: "Previous",
    href: "/meeting/previous",
  },
  {
    title: "Recordings",
    href: "/meeting/recordings",
  },
  {
    title: "Personal Room",
    href: "/meeting/personal-room",
  },
];

export const SettingsNavbarRoutes: NavType[] = [
  { title: "Profile", href: "/settings", assistant: true },
  {
    title: "Config",
    href: "/settings/config",
    assistant: true,
  },
  {
    title: "Chat",
    href: "/settings/chat",
  },
  {
    title: "Availability",
    href: "/settings/availability",
  },
  // {
  //   title: "Notifications",
  //   href: "/settings/notifications",
  // },
  {
    title: "Display",
    href: "/settings/display",
    assistant: true,
  },
];