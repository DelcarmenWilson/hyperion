import React from "react";
import { Plus } from "lucide-react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { cn } from "@/lib/utils";

import { LabelColor, labelColors, checkBoxColors } from "@/types/appointment";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyCard } from "@/components/reusable/empty-card";

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
                checkBoxColors[lbl.color as LabelColor]
              )}
            />
            <p className={cn("flex-1 px-1 capitalize")}>{lbl.name}</p>
          </label>
        ))}
      </div>
    </div>
  );
}
