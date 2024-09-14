import { currentUser } from "@/lib/auth";

import { DashBoardClient } from "./components/client";
import { AppointmentClient } from "@/components/lead/appointments/client";
import { AgentSummaryClient } from "./components/agentsummary/client";
import { TurnOverRate } from "./components/turnover/turn-over-rate";
import { CallHistoryClient } from "@/components/callhistory/client";
import { QuoteClient } from "./components/quote-client";
import { BluePrintClient } from "./components/blueprint/client";
import { SharedCallsClient } from "@/components/global/shared-calls";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppInitailEmail } from "@/emails/app-remainder-email";

const DashBoardPage = async () => {
  const user = await currentUser();
  return (
    <ScrollArea>
      <div className="flex flex-col gap-4">
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

        {/* <AppInitailEmail
        username="wdelcarmen"
          teamName="Strongside Financial"
          firstName="Wilson"
          appId="sssssssss"
          dateTime={new Date("12/24/23 21:17")}
          cellPhone="347-8030962"
        /> */}
      </div>
    </ScrollArea>
  );
};

export default DashBoardPage;
