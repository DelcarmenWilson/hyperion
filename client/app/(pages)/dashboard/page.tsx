import { currentUser } from "@/lib/auth";

import { DashBoardClient } from "./components/client";
import { AppointmentClient } from "@/components/lead/appointments/client";
import { AgentSummaryClient } from "./components/agentsummary/client";
import { TurnOverRate } from "./components/turnover/turn-over-rate";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";
import { QuoteClient } from "./components/quote-client";
import { BluePrintClient } from "./components/blueprint-client";

const DashBoardPage = async () => {
  const user = await currentUser();
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <DashBoardClient />
      <QuoteClient />
      <AppointmentClient showLink />
      {user?.role == "MASTER" && <AgentSummaryClient />}

      <div className="flex flex-col items-center gap-4 h-[400px] lg:flex-row">
        <div className="w-full lg:w-[25%] h-full">
          {/* <TurnOverRate /> */}
          <BluePrintClient/>
        </div>
        <div className="w-full lg:w-[75%] h-full">
          <CallHistoryClient showLink />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
