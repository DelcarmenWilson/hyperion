import React from "react";
import { Plus } from "lucide-react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { cn } from "@/lib/utils";
import { HyperionColors } from "@/lib/colors";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyCard } from "@/components/reusable/empty-card";

const checkBoxColors = {
  [HyperionColors.INDIGO]:
    "data-[state=checked]:bg-indigo-500 border-indigo-500",
  [HyperionColors.GRAY]: "data-[state=checked]:bg-gray-500 border-gray",
  [HyperionColors.GREEN]: "data-[state=checked]:bg-green-500 border-green",
  [HyperionColors.BLUE]: "data-[state=checked]:bg-blue-500 border-blue-500",
  [HyperionColors.RED]: "data-[state=checked]:bg-red-500 border-red-500",
  [HyperionColors.PURPLE]: "data-[state=checked]:bg-purple-500 border-purple",
  [HyperionColors.PRIMARY]: "",
};
const labelColors = {
  [HyperionColors.INDIGO]: "bg-indigo-200",
  [HyperionColors.GRAY]: "bg-gray-200",
  [HyperionColors.GREEN]: "bg-green-200",
  [HyperionColors.BLUE]: "bg-blue-200",
  [HyperionColors.RED]: "bg-red-200",
  [HyperionColors.PURPLE]: "bg-purple-200",
  [HyperionColors.PRIMARY]: "bg-primary text-background",
};

export default function Labels() {
  const { setShowLabelModal, labels, updateLabel } = useCalendarStore();
  return (
    <div className="flex flex-1 flex-col h-full gap-2 overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 font-bold ">Labels</p>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowLabelModal(true)}
        >
          <Plus size={15} />
        </Button>
      </div>

      {!labels?.length && <EmptyCard title="No Labels Yet" />}
      <div className="flex flex-col gap-1 overflow-x-auto">
        {labels?.map((lbl) => (
          <label
            key={lbl.id}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Checkbox
              checked={lbl.checked}
              onCheckedChange={() =>
                updateLabel({ ...lbl, checked: !lbl.checked })
              }
              className={cn(
                "rounded-none",
                checkBoxColors[lbl.color as HyperionColors]
              )}
            />
            <p className={cn("flex-1 px-1 capitalize")}>{lbl.name}</p>
          </label>
        ))}
      </div>
    </div>
  );
}
