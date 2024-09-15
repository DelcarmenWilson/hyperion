"use client";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useSchedule, useScheduleBreak } from "@/hooks/use-schedule";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { ScheduleDay } from "@/formulas/schedule";
import { formatJustTime } from "@/formulas/dates";

//TODO need to do some validation before sending it to the front
export const ScheduleBreakModal = ({
  setDay,
}: {
  setDay: (e: ScheduleDay) => void;
}) => {
  const { isOpen, onClose, schedule } = useSchedule();
  const {
    scd,
    showBreak1,
    showBreak2,
    setShowBreak,
    onSetSchedule,
    onResetSchedule,
    onSubmit,
  } = useScheduleBreak(schedule, setDay, onClose);

  if (!scd) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription className="hidden">
        Schedule Break Form
      </DialogDescription>
      <DialogContent className="flex flex-col justify-start min-h-[50%] max-h-[75%] w-full">
        <h4 className="text-2xl font-semibold py-2">
          <span className=" text-primary"> Breaks - </span>
          <span className="capitalize"> {scd.day}</span>
        </h4>
        <p>
          Available Hours {formatJustTime(scd.workFrom)}
          {" - "}
          {formatJustTime(scd.workTo)}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {showBreak1 ? (
            <>
              <p className="flex items-center justify-center text-xl font-semibold col-span-2 ">
                <span>Break # 1</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onResetSchedule(1)}
                >
                  <RefreshCcw size={16} />
                </Button>
              </p>
              {/* BREAK FROM 1 */}
              <Input
                name="txtBreakFrom1"
                defaultValue={scd.breakFrom1}
                onChange={(e) => onSetSchedule("breakFrom1", e.target.value)}
                autoComplete="time"
                type="time"
                step="300"
              />

              {/* BREAK TO 1 */}
              <Input
                name="txtBreakTo1"
                defaultValue={scd.breakTo1}
                onChange={(e) => onSetSchedule("breakTo1", e.target.value)}
                autoComplete="time"
                type="time"
                step="300"
              />
            </>
          ) : (
            <div className="flex justify-between items-center col-span-2">
              <span className=" text-muted-foreground font-semibold">
                No Breaks
              </span>
              <Button variant="ghost" size="xs" onClick={() => setShowBreak(1)}>
                + Add Break
              </Button>
            </div>
          )}

          {showBreak2 ? (
            <>
              <p className="flex items-center justify-center text-xl font-semibold col-span-2 ">
                <span>Break # 2</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onResetSchedule(2)}
                >
                  <RefreshCcw size={16} />
                </Button>
              </p>
              {/* BREAK FROM 2 */}
              <Input
                name="txtBreakFrom2"
                defaultValue={scd.breakFrom2}
                onChange={(e) => onSetSchedule("breakFrom2", e.target.value)}
                autoComplete="time"
                type="time"
                step="300"
              />
              {/* BREAK TO 2 */}
              <Input
                name="txtBreakTo2"
                defaultValue={scd.breakTo2}
                onChange={(e) => onSetSchedule("breakTo2", e.target.value)}
                autoComplete="time"
                type="time"
                step="300"
              />
            </>
          ) : (
            <div className="col-span-2 text-right">
              {showBreak1 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowBreak(2)}
                >
                  + Add Break
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-2 justify-between my-2 mt-auto">
          <Button onClick={onClose} type="button" variant="outlineprimary">
            Cancel
          </Button>

          <Button onClick={onSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
