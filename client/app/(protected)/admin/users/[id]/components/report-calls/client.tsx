"use client";
import { CardLayout } from "@/components/custom/card/layout";
import { formatSecondsToTime } from "@/formulas/numbers";
import { convertCallData } from "@/formulas/reports";
import { FullCall } from "@/types";
import { format } from "date-fns";
import { ClipboardList } from "lucide-react";
import React from "react";

type ReportCallsClientProps = {
  from: string;
  to: string;
  calls: FullCall[];
};

export const ReportCallsClient = ({
  calls,
  from,
  to,
}: ReportCallsClientProps) => {
  const report = convertCallData(calls);
  return (
    <CardLayout
      title={`Calls Report -  ${format(from, "MM/dd/yy")} - ${format(
        to,
        "MM/dd/yy"
      )}`}
      icon={ClipboardList}
    >
      <div className="grid grid-cols-3 gap-2 text-sm w-full">
        <span>Date</span>
        <span>Duration</span>
        <span>Total Calls</span>
        {report.map((item) => (
          <>
            <span>{format(item.day, "MM-dd-yy")}</span>
            <span>{formatSecondsToTime(item.duration)}</span>
            <span>{item.total}</span>
          </>
        ))}
      </div>
    </CardLayout>
  );
};
