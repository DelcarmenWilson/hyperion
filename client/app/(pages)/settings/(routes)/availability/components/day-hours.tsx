"use client";
import { useState } from "react";
import { useSchedule } from "@/hooks/use-schedule";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { ScheduleDay } from "@/formulas/schedule";
import { formatJustTime } from "@/formulas/dates";

type DayHoursProps = {
  schedule: ScheduleDay;
  disabled: boolean;
  onSetAvail: (e: number, a: boolean) => void;
  onSetWorkHours: (e: number, type: "from" | "to", time: string) => void;
};

export const DayHour = ({
  schedule,
  disabled,
  onSetAvail,
  onSetWorkHours,
}: DayHoursProps) => {
  const { onOpen } = useSchedule();
  const [available, setAvailable] = useState(schedule.available);
  const index = schedule.index;

  const onSetAvailable = (e: boolean) => {
    setAvailable(e);
    onSetAvail(index, e);
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 items-center gap-2 mb-2">
      <div className="flex justify-between gap-2 text-sm text-muted-foreground">
        <p className=" capitalize">{schedule.day}</p>
        <div>
          <Switch
            disabled={disabled}
            name="cblAvailable"
            checked={available}
            onCheckedChange={(e) => onSetAvailable(e)}
          />
        </div>
      </div>
      {available ? (
        <div className="grid col-span-5 grid-cols-2 lg:grid-cols-4 items-center gap-2">
          <Input
            name="txtWorkFrom"
            disabled={disabled}
            type="time"
            defaultValue={schedule.workFrom}
            autoComplete="time"
            step="300"
            onChange={(e) => {
              onSetWorkHours(index, "from", e.target.value);
            }}
          />
          <Input
            name="txtWorkTo"
            disabled={disabled}
            type="time"
            defaultValue={schedule.workTo}
            autoComplete="time"
            step="300"
            onChange={(e) => {
              onSetWorkHours(index, "to", e.target.value);
            }}
          />
          <Button
            className="justify-between col-span-2"
            type="button"
            variant="secondary"
            onClick={() => onOpen(schedule)}
          >
            <span>
              {formatJustTime(schedule.breakFrom1)}
              {" - "}
              {formatJustTime(schedule.breakTo1)}
            </span>
            {!schedule.breakFrom1 && <span> No Breaks</span>}
            {schedule.breakFrom2 && <span>|</span>}
            <span>
              {formatJustTime(schedule.breakFrom2)}
              {" - "}
              {formatJustTime(schedule.breakTo2)}
            </span>
          </Button>
        </div>
      ) : (
        <Input
          className="text-center"
          disabled
          type="text"
          value="Not Available"
          autoComplete="time"
        />
      )}
    </div>
  );
};
