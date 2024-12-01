"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

import AboutMeCard from "./components/about-me-card";
import { CallHistoryClient } from "@/components/callhistory/client";
import CredentialsCard from "./components/credentials-card";
import ReportCallsCard from "./components/report-calls-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SharedCallsClient } from "@/components/global/shared-calls";
import { UserClient } from "./components/client";

import { startOfWeek } from "date-fns";
import { DateRange } from "react-day-picker";

const UserPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfWeek(new Date()),
    to: new Date(),
  });

  const params = useParams();
  const userId = params.id as string;

  return (
    <ScrollArea>
      <div className="flex flex-col h-full gap-4">
        <UserClient
          userId={userId}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CredentialsCard userId={userId} />
          <AboutMeCard userId={userId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SharedCallsClient />
          <ReportCallsCard userId={userId} dateRange={dateRange} />
        </div>
        <CallHistoryClient userId={userId} />
      </div>
    </ScrollArea>
  );
};

export default UserPage;
