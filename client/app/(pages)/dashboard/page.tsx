import { currentUser } from "@/lib/auth";

import { DashBoardClient } from "./components/client";
import { AppointmentClient } from "@/components/lead/appointments/client";
import { AgentSummaryClient } from "./components/agentsummary/client";
import { TurnOverRate } from "./components/turnover/turn-over-rate";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";
import { QuoteClient } from "./components/quote-client";
import { BluePrintClient } from "./components/blueprint/client";
import { SharedCallsClient } from "@/components/global/shared-calls";

const DashBoardPage = async () => {
  const user = await currentUser();
  return (
    <div className="flex flex-col gap-4 pt-4 overflow-y-auto">
      <DashBoardClient />
      <QuoteClient />
      <AppointmentClient showLink />
      {user?.role == "MASTER" && <AgentSummaryClient />}

      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <div className="flex w-full lg:w-[25%] h-full">
          {/* <TurnOverRate /> */}
          <BluePrintClient />
        </div>
        <div className="w-full lg:w-[75%] h-full">
          <CallHistoryClient showLink />
        </div>
      </div>
      <SharedCallsClient columns={4} />
    </div>
  );
};

export default DashBoardPage;
