"use client";
import React from "react";
import { ClipboardList } from "lucide-react";
import { useCallHistoryData } from "@/components/callhistory/hooks/use-call-history";

import { DateRange } from "react-day-picker";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { CardLayout } from "@/components/custom/card/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatSecondsToTime } from "@/formulas/numbers";
import { CallReportData, convertCallData } from "@/formulas/reports";
import { formatDate } from "@/formulas/dates";

type Props = {
  userId: string;
  dateRange: DateRange;
};

const ReportCallsCard = ({ userId, dateRange }: Props) => {
  const { calls, callsFetching } = useCallHistoryData(dateRange, userId, false);
  const report = convertCallData(calls);
  return (
    <SkeletonWrapper isLoading={callsFetching}>
      <CardLayout
        title={`Calls Report - ${formatDate(dateRange.from)} - ${formatDate(
          dateRange.to
        )}`}
        icon={ClipboardList}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date </TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Total Calls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.length == 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <p className="flex-center p-4 text-muted-foreground text-sm">
                    No calls were made durin this time period
                  </p>
                </TableCell>
              </TableRow>
            )}
            {report.map((item) => (
              <ReportCard key={item.day} item={item} />
            ))}
          </TableBody>
        </Table>
      </CardLayout>
    </SkeletonWrapper>
  );
};

export default ReportCallsCard;

const ReportCard = ({ item }: { item: CallReportData }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{formatDate(item.day)}</TableCell>
      <TableCell>{formatSecondsToTime(item.duration)}</TableCell>
      <TableCell>{item.total}</TableCell>
    </TableRow>
  );
};
