"use client";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useScheduleBreak } from "@/hooks/use-schedule-break";
import { ScheduleDay } from "@/formulas/schedule";
import { ScheduleDaySchema } from "@/schemas/schedule";
import { formatJustTime } from "@/formulas/dates";
import { RefreshCcw } from "lucide-react";

//TODO need to do some validation before sending it to the front
export const ScheduleBreakModal = ({
  setDay,
}: {
  setDay: (e: ScheduleDay) => void;
}) => {
  const { isOpen, onClose, schedule } = useScheduleBreak();
  const [scd, setScd] = useState(schedule);

  const showBreak1 = scd?.breakFrom1 !== undefined;
  const showBreak2 = scd?.breakFrom2 !== undefined;

  const setShowBreak = (type: number) => {
    setScd((sc) => {
      if (!sc) return sc;
      if (type == 1) {
        if (schedule?.breakFrom1) {
          return {
            ...sc,
            breakFrom1: schedule?.breakFrom1,
            breakTo1: schedule?.breakTo1,
          };
        }
        return { ...sc, breakFrom2: "12:00", breakTo2: "13:00" };
      }
      if (schedule?.breakFrom2) {
        return {
          ...sc,
          breakFrom2: schedule?.breakFrom2,
          breakTo2: schedule?.breakTo2,
        };
      }
      return { ...sc, breakFrom2: "13:00", breakTo2: "14:00" };
    });
  };

  const onSetSchedule = (bk: string, val: string) => {
    setScd((sc) => {
      if (!sc) return sc;
      return { ...sc, [bk]: val };
    });
  };

  const onResetSchedule = (type: number) => {
    setScd((sc) => {
      if (!sc) return sc;
      if (type == 1)
        return {
          ...sc,
          breakFrom1: undefined,
          breakTo1: undefined,
          breakFrom2: undefined,
          breakTo2: undefined,
        };

      return { ...sc, breakFrom2: undefined, breakTo2: undefined };
    });
  };
  const onCancel = () => {
    onClose();
  };

  const onSubmit = () => {
    if (!scd) return;
    setDay(scd);
    onClose();
  };
  useEffect(() => {
    if (!schedule) return;
    setScd(schedule);
  }, [schedule]);

  if (!scd) return;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>

          <Button onClick={onSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ScheduleBreakModalOld = () => {
  const { isOpen, onClose, schedule } = useScheduleBreak();
  const [loaded, setIsLoaded] = useState(false);

  const form = useForm<ScheduleDay>({
    resolver: zodResolver(ScheduleDaySchema),
    defaultValues: schedule,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = (values: ScheduleDay) => {
    onClose();
    console.log(values);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, [loaded]);

  if (!loaded) return;
  console.log(form.getValues());
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-start min-h-[50%] max-h-[75%] w-full">
        <h4 className="text-2xl font-semibold py-2">
          <span className=" text-primary"> Breaks - </span>
          <span className="capitalize"> {schedule?.day}</span>
        </h4>
        <p>
          Availbale Hours {formatJustTime(schedule?.workFrom)}
          {" - "}
          {formatJustTime(schedule?.workTo)}
        </p>
        {/* <div className="grid grid-cols-2 gap-2">
          <div>
            <p>From</p>
            <Input
              name="txtBreakFrom"
              type="time"
              defaultValue={breaks?.from}
              onChange={(e) => onSetBreakFrom(e.target.value)}
              autoComplete="time"
              step="300"
            />
          </div>
          <div>
            <p>To</p>
            <Input
              name="txtBreakTo"
              type="time"
              defaultValue={breaks?.to}
              onChange={(e) => onSetBreakTo(e.target.value)}
              autoComplete="time"
              step="300"
            />
          </div>
        </div> */}

        <Form {...form}>
          <form
            className="space-y-2 px-2 w-full flex-1 overflow-y-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-2">
              <p className="text-xl font-semibold col-span-2 text-center">
                Break # 1
              </p>
              {/* BREAK FROM 1 */}
              <FormField
                control={form.control}
                name="breakFrom1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        {...field}
                        name="txtBreakFrom1"
                        autoComplete="time"
                        // type="time"
                        // step="300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* BREAK TO 1 */}
              <FormField
                control={form.control}
                name="breakTo1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        {...field}
                        name="txtBreakTo1"
                        autoComplete="time"
                        // type="time"
                        // step="300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-xl font-semibold col-span-2 text-center">
                Break # 2
              </p>
              {/* BREAK FROM 2 */}
              <FormField
                control={form.control}
                name="breakFrom2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        {...field}
                        name="txtBreakFrom2"
                        autoComplete="time"
                        // type="time"
                        // step="300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* BREAK TO 2 */}
              <FormField
                control={form.control}
                name="breakTo2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        {...field}
                        name="txtBreakTo2"
                        autoComplete="time"
                        defaultValue={field.value}
                        // type="time"
                        // step="300"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
              <Button onClick={onCancel} type="button" variant="outlineprimary">
                Cancel
              </Button>

              <Button>Save</Button>
            </div>
          </form>
        </Form>

        {/* <CardData
          label="Date"
          value={formatDate(appointment.startDate, "MM-dd-yy")}
        /> */}
      </DialogContent>
    </Dialog>
  );
};
