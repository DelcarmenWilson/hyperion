"use client";
import React, { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { scheduleTimes } from "@/constants/schedule-times";

export const BookClient = () => {
  const [times, setTimes] = useState(scheduleTimes);
  const [selectedDate, setselectedDate] = useState(new Date());
  const [selectedTime, setselectedTime] = useState("");

  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col gap-2 w-[600px]">
        <div className="flex flex-col justify-center items-center gap-2 ">
          <Image
            src="/assets/wdelcarmen.jpg"
            width={80}
            height={80}
            alt="Profile Image"
          />
          <p className="font-bold text-2xl">Book an Appointment with Wilson</p>
          <p className="text-sm">
            Pick the time that best works for you. I am looking forward to
            connecting with you.
          </p>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(e) => setselectedDate(e!)}
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            {/* <Input value={selectedDate.toDateString()} />
            <Input value={selectedTime} /> */}

            {selectedDate && (
              <div className="grid grid-cols-4 font-bold text-sm gap-2">
                {times.map((time) => (
                  <Button
                    disabled={time.disabled}
                    key={time.value}
                    onClick={() => setselectedTime(time.value)}
                  >
                    {time.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedTime && (
          <div className="text-right">
            <Button variant="outlineprimary">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};
