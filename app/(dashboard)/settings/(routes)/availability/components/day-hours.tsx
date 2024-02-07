"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface DayHoursProps {
  day: string;
  hours: string;
  setHours: (e: string) => void;
  disabled: boolean;
}
export const DayHour = ({ day, hours, setHours, disabled }: DayHoursProps) => {
  const [available, setAvailable] = useState(hours != "Not Available");
  const scheduleBreak = hours.split(",");
  const [workFrom, setWorkFrom] = useState(
    available ? scheduleBreak[0].split("-")[0] : "09:00"
  );
  const [workTo, setWorkTo] = useState(
    available ? scheduleBreak[0].split("-")[1] : "18:00"
  );

  const [breakFrom, setBreakFrom] = useState(
    available ? scheduleBreak[1].split("-")[0] : "12:00"
  );
  const [breakTo, setBreakTo] = useState(
    available ? scheduleBreak[1].split("-")[1] : "13:00"
  );

  const onSetAvailable = (e: boolean) => {
    if (e) setHours("09:00-18:00,12:00-13:00");
    else setHours("Not Available");
    setAvailable(e);
  };

  const onSetWorkFrom = (time: string) => {
    setWorkFrom(time);
    setHours(`${time}-${workTo},${breakFrom}-${breakTo}`);
  };
  const onSetWorkTo = (time: string) => {
    setWorkTo(time);
    setHours(`${workFrom}-${time},${breakFrom}-${breakTo}`);
  };
  const onSetBreakFrom = (time: string) => {
    setBreakFrom(time);
    setHours(`${workFrom}-${workTo},${time}-${breakTo}`);
  };
  const onSetBreakTo = (time: string) => {
    setBreakTo(time);
    setHours(`${workFrom}-${workTo},${breakFrom}-${time}`);
  };

  return (
    <div className="grid grid-cols-5 items-center gap-2 mb-2">
      <div className="flex justify-between gap-2 text-sm text-muted-foreground">
        <p>{day}</p>
        <div>
          <Switch
            disabled={disabled}
            name="cblRecord"
            checked={available}
            onCheckedChange={(e) => onSetAvailable(e)}
          />
        </div>
      </div>
      {available ? (
        <div className="grid col-span-4 grid-cols-4 items-center gap-2">
          <Input
            name="txtWorkFrom"
            disabled={disabled}
            type="time"
            defaultValue={workFrom}
            onChange={(e) => onSetWorkFrom(e.target.value)}
            autoComplete="time"
            step="300"
          />
          <Input
            name="txtWorkTo"
            disabled={disabled}
            type="time"
            defaultValue={workTo}
            onChange={(e) => onSetWorkTo(e.target.value)}
            autoComplete="time"
            step="300"
          />
          <Input
            name="txtBreakFrom"
            disabled={disabled}
            type="time"
            defaultValue={breakFrom}
            onChange={(e) => onSetBreakFrom(e.target.value)}
            autoComplete="time"
            step="300"
          />
          <Input
            name="txtWorkTo"
            disabled={disabled}
            type="time"
            defaultValue={breakTo}
            onChange={(e) => onSetBreakTo(e.target.value)}
            autoComplete="time"
            step="300"
          />
        </div>
      ) : (
        <Input disabled type="text" value="Not Available" autoComplete="time" />
      )}
    </div>
  );
};
