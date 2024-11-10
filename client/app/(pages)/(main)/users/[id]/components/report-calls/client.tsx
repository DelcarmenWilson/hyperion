"use client";
import React from "react";
import { ClipboardList } from "lucide-react";
import { FullCall } from "@/types";
import { CardLayout } from "@/components/custom/card/layout";
import { formatSecondsToTime } from "@/formulas/numbers";
import { convertCallData } from "@/formulas/reports";
import { formatDate, formatDateTime } from "@/formulas/dates";

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
      title={`Calls Report -  ${formatDate(from)} - ${formatDate(to)}`}
      icon={ClipboardList}
    >
      <div className="grid grid-cols-3 gap-2 text-sm w-full">
        <span>Date</span>
        <span>Duration</span>
        <span>Total Calls</span>
        {report.map((item) => (
          <>
            <span>{formatDate(item.day)}</span>
            <span>{formatSecondsToTime(item.duration)}</span>
            <span>{item.total}</span>
          </>
        ))}
      </div>
    </CardLayout>
  );
};
