import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

const NewEmptyCard = ({
  icon,
  button,
  title,
  subTitle,
}: {
  icon: LucideIcon;
  button?: ReactNode;
  title: string;
  subTitle: string;
}) => {
  const Icon = icon;
  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center">
      <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
        <Icon size={40} className="stroke-primary" />
      </div>
      <div className="flex flex-col gap-1 text-center">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-muted-foreground">{subTitle}</p>
      </div>
      {button && button}
    </div>
  );
};

export default NewEmptyCard;
