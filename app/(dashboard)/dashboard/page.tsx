import { currentUser } from "@/lib/auth";
import { AppointmentColumn } from "./components/appointment/columns";
import { AgentSummaryColumn } from "./components/agentsummary/columns";

import { appointmentsGetAllByUserId } from "@/data/appointment";
import { callGetAllByAgentId } from "@/data/call";
import { messagesGetByAgentIdUnSeen } from "@/data/message";
import { leadsGetByAgentIdTodayCount } from "@/data/lead";
import { DashBoardClient, DashBoardClientSkeleton } from "./components/client";
import { usersGetSummaryByTeamId } from "@/data/user";
import { CallHistoryColumn } from "./components/callhistory/columns";
import { Suspense } from "react";

const DahsBoardPage = async () => {
  const user = await currentUser();
  const leadCount = await leadsGetByAgentIdTodayCount(user?.id!);
  const messagesCount = await messagesGetByAgentIdUnSeen(user?.id!);

  const appointments = await appointmentsGetAllByUserId(user?.id!);

  const formattedAppointments: AppointmentColumn[] = appointments.map(
    (apt) => ({
      id: apt.id,
      fullName: `${apt.lead.firstName} ${apt.lead.lastName}`,
      email: apt.lead.email,
      phone: apt.lead.cellPhone,
      status: apt.status,
      dob: apt.lead.dateOfBirth || undefined,
      date: apt.date,
      comments: apt.comments,
    })
  );
  const agents = await usersGetSummaryByTeamId(
    user?.id!,
    user?.role!,
    user?.team!
  );
  const formattedAgents: AgentSummaryColumn[] = agents.map((agent) => ({
    id: agent.id,
    username: agent.username,
    email: agent.email as string,
    subscriptionExpires: "12-31-2029",
    balance: "100",
    leadsPending: "0",
    carrierViolations: "0",
    coaching: agent.chatSettings?.coach!,
    currentCall: agent.chatSettings?.currentCall!,
  }));

  const calls = await callGetAllByAgentId(user?.id!);

  const formatedCallHistory: CallHistoryColumn[] = calls.map((call) => ({
    id: call.id,
    agentName: user?.name!,
    phone: call.lead?.cellPhone!,
    from: call.from,
    direction: call.direction,
    fullName: `${call.lead?.firstName} ${call.lead?.lastName}`,
    email: call.lead?.email!,
    duration: call.duration!,
    date: call.createdAt,
    recordUrl: call.recordUrl as string,
    lead: call.lead || undefined,
  }));

  const outBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "outbound"
  ).length;

  const inBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "inbound"
  ).length;

  return (
    <Suspense fallback={<DashBoardClientSkeleton />}>
      <DashBoardClient
        leadCount={leadCount}
        messagesCount={messagesCount}
        inBoundCallsCount={inBoundCallsCount}
        outBoundCallsCount={outBoundCallsCount}
        appointments={formattedAppointments}
        agents={formattedAgents}
        callHistory={formatedCallHistory}
      />
      {/* <DashBoardClientSkeleton /> */}
    </Suspense>
  );
};

export default DahsBoardPage;
