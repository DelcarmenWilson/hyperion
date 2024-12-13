import {
  BarChart,
  Blocks,
  Eye,
  FileCheck,
  List,
  ListChecks,
  LucideIcon,
  Mail,
  MailCheck,
  MapPin,
  MessageCircle,
  NotepadText,
  PhoneOutgoing,
  PlugZap,
  Settings,
  Smartphone,
  SmartphoneCharging,
  StickyNote,
  TabletSmartphone,
  TrendingUp,
  UserCog,
  UserPlus,
  Users2,
  Webhook,
} from "lucide-react";
export type FeatureType = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const callingData: FeatureType[] = [
  {
    icon: Smartphone,
    title: "Cloud VoIP Softphone",
    description:
      " Built-in VoIP softphone complete with progressive dialing, click-to-call, instant alerts, automatic call logs, call recordings, and more mean that your sales team can work smarter, not harder, no matter where they are.",
  },

  {
    icon: MapPin,
    title: "Local ID",
    description:
      "Boost answered calls and gain more opportunities to sell with local ID. Skyrocket your connection rate by choosing a local number that matches your prospects area.",
  },

  {
    icon: Eye,
    title: "Complete Contact Visibility",
    description:
      "Never go into a call without the complete context behind a prospect again. See relationship history at a glance, and adapt your pitch to match.",
  },
];

const emailData: FeatureType[] = [
  {
    icon: Mail,
    title: "Automatic Messages",
    description:
      "Contact customers and leads at the right time. Leverage data to know when to send messages to maximize open rates.",
  },

  {
    icon: Settings,
    title: "Personalization",
    description:
      "Send automated and personalized texts and emails to your leads based on specific triggers to keep your prospects engaged.",
  },

  {
    icon: NotepadText,
    title: "Templates",
    description:
      "Create preset replies to respond to your leads faster. Hyperion fills in personalization details to resonate with your leads.",
  },
];
const marketingData: FeatureType[] = [
  {
    icon: MessageCircle,
    title: "Drip Campaigns",
    description:
      "Engage with leads or delight existing customers with communication sequences that work in the background.",
  },

  {
    icon: Users2,
    title: "Lead Segmentation",
    description:
      "Segment your audience to send tailored messages at scale. Send the right messages to the right people at the right time.",
  },

  {
    icon: BarChart,
    title: "Nurture Prospects",
    description:
      "Send emails or SMS—whichever works best for your leads—and watch the conversions roll in.",
  },
];

const salesData: FeatureType[] = [
  {
    icon: List,
    title: "Lead Management",
    description:
      "Effortlessly track, manage, and organize your leads with an automated sales pipeline.",
  },
  {
    icon: MapPin,
    title: "Communications Tracking",
    description:
      "Each lead has a dedicated view, so you can look at past emails, texts, and calls at a glance.",
  },
  {
    icon: TrendingUp,
    title: "Insights & Reports",
    description:
      "Understand what works and what doesn’t based on actual data, not feeling, and capitalize on winning strategies.",
  },
];

const automationData: FeatureType[] = [
  {
    icon: ListChecks,
    title: "Set Tasks",
    description:
      "Reduce human error and kill repetitive tasks with automation. Keep your workflows moving forward and give yourself more time to focus on closing deals and developing relationships with prospects.",
  },
  {
    icon: UserPlus,
    title: "Enter Leads",
    description:
      "Easily keep track of leads with a simple tagging system. Leads will be automatically sorted in your sales pipeline.",
  },
  {
    icon: MailCheck,
    title: "Send Communications",
    description:
      "78% of prospects buy from the company that contacts them first. Automations take care of that first touch without you lifting a finger.",
  },
];

const mobileData: FeatureType[] = [
  {
    icon: PhoneOutgoing,
    title: "Remote Calling",
    description:
      "Keep in touch with your team and prospects wherever you are using Hyperion’s built-in VoIP softphone.",
  },
  {
    icon: TabletSmartphone,
    title: "Email and SMS Functionality",
    description:
      "Communicate with your leads and customers the way they want—respond to emails and SMS seamlessly with Hyperion’s mobile app.",
  },
  {
    icon: StickyNote,
    title: "Leads and Notes",
    description:
      "Get the full picture of each individual lead at a glance so you never miss a beat.",
  },
];

const integrationsData: FeatureType[] = [
  {
    icon: PlugZap,
    title: "Connect Out of the Box",
    description:
      "Seamlessly integrate with Zapier, Facebook, Google Calendar, and more as soon as you open Hyperion.",
  },
  {
    icon: Webhook,
    title: "Hyperion API",
    description:
      "Create custom integrations with ease with Hyperion’s straightforward API. Get support from our customer service team at no additional cost.",
  },
  {
    icon: Blocks,
    title: "Automatic Lead Vendor Integration",
    description:
      "Easily integrate with lead vendors that you use every day to keep your workflow moving forward.",
  },
];

const privacyData: FeatureType[] = [
  {
    icon: UserCog,
    title: "User Account Control",
    description:
      "Implement essential security features like two-factor authentication and SSO to keep internal data safe, and control user accounts on the fly with the master switch.",
  },
  {
    icon: SmartphoneCharging,
    title: "24/7 Support Team",
    description:
      "Get expert help with your privacy and security whenever you need it for no additional cost.",
  },
  {
    icon: FileCheck,
    title: "Full Regulatory Compliance",
    description:
      "Hyperion makes it easy to stay compliant with legal requirements with reminders and recommended actions on your home dashboard.",
  },
];

export const FeatureContent: {
  type: string;
  name: string;
  data: FeatureType[];
  src: string;
}[] = [
  //   {
  //     type: "calling",name:"calling",
  //     data: callingData,
  //     src: "/assets/landing/calling.png",
  //   },
  {
    type: "email",
    name: "email & sms",
    data: emailData,
    src: "/assets/landing/email.svg",
  },
  {
    type: "marketing",
    name: "marketing",
    data: marketingData,
    src: "/assets/landing/marketing.svg",
  },
  {
    type: "sales",
    name: "sales",
    data: salesData,
    src: "/assets/landing/sales.svg",
  },
  {
    type: "automation",
    name: "automation",
    data: automationData,
    src: "/assets/landing/automation.svg",
  },
  {
    type: "mobileapp",
    name: "mobileapp",
    data: mobileData,
    src: "/assets/landing/mobileapp.svg",
  },
  {
    type: "integrations",
    name: "integrations",
    data: integrationsData,
    src: "/assets/landing/integration.svg",
  },
  {
    type: "privacy",
    name: "privacy & security",
    data: privacyData,
    src: "/assets/landing/privacy.svg",
  },
];
