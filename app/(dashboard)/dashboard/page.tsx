import { currentUser } from "@/lib/auth";
import { AgentSummaryColumn } from "./components/agentsummary/columns";

import { appointmentsGetAllByUserIdToday } from "@/actions/appointment";
import { callsGetAllByAgentIdLast24Hours } from "@/actions/call";
import { messagesGetByAgentIdUnSeen } from "@/actions/message";
import { leadsGetByAgentIdTodayCount } from "@/actions/lead";
import { DashBoardClient, DashBoardClientSkeleton } from "./components/client";
import { usersGetSummaryByTeamId } from "@/actions/user";
import { Suspense } from "react";

import { AppointmentClient } from "@/components/lead/appointments/client";
import { AgentSummaryClient } from "./components/agentsummary/client";
import { TurnOverRate } from "./components/turnover/turn-over-rate";
import { CallHistoryClient } from "@/components/reusable/callhistory/client";
import { QuoteClient } from "./components/quote-client";
import { adminQuotesGetActive } from "@/actions/admin";
import { Calendar } from "lucide-react";
import { PageLayout } from "@/components/custom/layout/page-layout";

const DahsBoardPage = async () => {
  const user = await currentUser();
  const leadCount = await leadsGetByAgentIdTodayCount(user?.id!);
  const messagesCount = await messagesGetByAgentIdUnSeen(user?.id!);

  const appointments = await appointmentsGetAllByUserIdToday(user?.id!);

  const agents = await usersGetSummaryByTeamId(
    user?.id!,
    user?.role!,
    user?.team!
  );

  const formattedAgents: AgentSummaryColumn[] = agents.map((agent) => ({
    id: agent.id,
    username: agent.userName,
    email: agent.email as string,
    subscriptionExpires: "12-31-2029",
    balance: "100",
    leadsPending: "0",
    carrierViolations: "0",
    coaching: agent.chatSettings?.coach!,
    currentCall: agent.chatSettings?.currentCall!,
  }));

  const calls = await callsGetAllByAgentIdLast24Hours(user?.id!);

  const outBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "outbound"
  ).length;

  const inBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "inbound"
  ).length;

  const quote = await adminQuotesGetActive();

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<DashBoardClientSkeleton />}>
        <DashBoardClient
          leadCount={leadCount}
          messagesCount={messagesCount}
          inBoundCallsCount={inBoundCallsCount}
          outBoundCallsCount={outBoundCallsCount}
        />
        <QuoteClient quote={quote!} />
        <PageLayout title="Appointments" icon={Calendar}>
          <AppointmentClient data={appointments} />
        </PageLayout>
        <AgentSummaryClient initialData={formattedAgents} />
        <div className="flex flex-col items-center gap-4 h-[400px] lg:flex-row">
          <div className="w-full lg:w-[25%] h-full">
            <TurnOverRate />
          </div>
          <div className="w-full lg:w-[75%] h-full">
            <CallHistoryClient initialCalls={calls} />
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default DahsBoardPage;
