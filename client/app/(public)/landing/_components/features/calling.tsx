import { Eye, LucideIcon, MapPin, Smartphone } from "lucide-react";
import React from "react";

const data = [
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
const Calling = () => {
  return (
    <div className="grid grid-cols-2">
      <div className="px-8 space-y-5">
        {data.map((item) => (
          <Box key={item.title} {...item} />
        ))}

        {/* 
        <Box
          icon={MapPin}
          title="Local ID"
          description="Boost answered calls and gain more opportunities to sell with local ID. Skyrocket your connection rate by choosing a local number that matches your prospects area."
        />

        <Box
          icon={Eye}
          title="Complete Contact Visibility"
          description="Never go into a call without the complete context behind a prospect again. See relationship history at a glance, and adapt your pitch to match."
        /> */}
      </div>

      <div className="px-8"> Dashboard image</div>
    </div>
  );
};
const Box = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-start gap-5">
      <div className=" bg-violet-700 p-4 rounded-full">
        <Icon size={15} />
      </div>
      <div>
        <p className="font-bold text-lg mb-5">{title}</p>
        <p className="w-[350px]">{description}</p>
      </div>
    </div>
  );
};
export default Calling;
