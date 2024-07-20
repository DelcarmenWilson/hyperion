import React from "react";
import { useAppointmentContext } from "@/providers/app";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getLabelBgColor, getLabelTextColor } from "@/formulas/labels";

export default function Labels() {
  const { userLabels, updateLabel, setShowLabelModal } =
    useAppointmentContext();
  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-gray-500 font-bold ">Labels</p>
        <Button onClick={() => setShowLabelModal(true)}>
          <Plus size={16} />
        </Button>
      </div>
      {userLabels?.map((lbl) => (
        <label key={lbl.id} className="flex items-center mt-3 cursor-pointer">
          {/* <Checkbox
            checked={checked}
            onCheckedChange={() =>
              updateLabel({ label: lbl, checked: !checked })
            }
            className={`bg-${lbl}-400 text-${lbl}-400`}
          /> */}
          <input
            type="checkbox"
            checked={lbl.checked}
            onChange={() => updateLabel({ ...lbl, checked: !lbl.checked })}
            className={`${getLabelBgColor(
              lbl.color
            )}  form-checkbox h-5 w-5 rounded focus:ring-0 cursor-pointer`}
          />
          <span className="ml-2 text-gray-700 capitalize">{lbl.name}</span>
        </label>
      ))}
    </>
  );
}
