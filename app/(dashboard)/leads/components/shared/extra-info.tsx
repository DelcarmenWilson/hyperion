"use client";
import { format } from "date-fns";
import { Pencil } from "lucide-react";

interface ExtraInfoProps {
  createdAt: Date;
}

const ExtraInfo = ({ createdAt }: ExtraInfoProps) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div>
        <p>Recieved on</p>
        <p>{format(createdAt, "MM-dd-yy h:mm aaaa")}</p>
      </div>
      <p className="flex gap-2 ">
        <span>Manually created</span>
        <Pencil className="h-4 w-4 ml-2 text-primary" />
      </p>
      <p className="flex gap-2 ">
        <span>
          Sale amount: <span className="text-destructive">Not set</span>
        </span>
        <Pencil className="h-4 w-4 ml-2 text-primary" />
      </p>
      <p className="flex gap-2">
        <span>
          Commision: <span className="text-destructive">Not set</span>
        </span>
        <Pencil className="h-4 w-4 ml-2 text-primary" />
      </p>
      <p className="flex gap-2">
        <span>
          Cost of lead: <span className="text-destructive">Not set</span>
        </span>
        <Pencil className="h-4 w-4 ml-2 text-primary" />
      </p>
    </div>
  );
};

export default ExtraInfo;
