"use client";

import { DateRangePicker } from "@/components/custom/date-range-picker";
import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { weekStartEnd } from "@/formulas/dates";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function TabsDemo() {
  const [rData, setRData] = useState("");

  const [dates, setDates] = useState(weekStartEnd());

  const onDateSelected = (e: any) => {
    setDates(e);
  };
  const onSubmit = () => {
    axios
      .post("/api/test", {
        from: dates.from.toUTCString(),
        to: dates.to.toUTCString(),
        // from: format(dates.from, "YYYY-MM-DD"),
        // to: format(dates.to, "YYYY-MM-DD"),
      })
      .then((data) => {
        setRData(data.data);
      });
    toast.success(JSON.stringify(dates));
  };
  return (
    <PageLayoutAdmin title="Test" description="Testing Page">
      <div>
        <p className="text-muted-foreground">Date Range</p>
        <DateRangePicker
          setDate={onDateSelected}
          date={dates}
          className="flex"
        />
      </div>
      <Button onClick={onSubmit}>Submit</Button>
      {JSON.stringify(rData)}
    </PageLayoutAdmin>
  );
}
export default TabsDemo;
