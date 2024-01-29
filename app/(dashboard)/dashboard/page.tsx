import { currentUser } from "@/lib/auth";
import { MessageSquareText, Phone, PhoneIncoming, Users } from "lucide-react";
import { Box } from "./components/box";
import { AppointmentBox } from "./components/appointment/appointment-box";
import { AppointmentColumn } from "./components/appointment/columns";
import { AgentSummary } from "./components/agentsummary/agent-summary";
import { AgentSummaryColumn } from "./components/agentsummary/columns";
import { CallHistoryColumn } from "./components/callhistory/columns";
import { CallHistory } from "./components/callhistory/call-history";

import { appointmentGetAll } from "@/data/appointment";
import { callGetAllByAgentId } from "@/data/call";
import { messagesGetByAgentIdUnSeen } from "@/data/message";
import { leadsGetByAgentIdTodayCount } from "@/data/lead";
import DashBoardClient from "./components/client";

const DahsBoardPage = async () => {
  const user = await currentUser();
  const leadCount = await leadsGetByAgentIdTodayCount(user?.id!);
  const messagesCount = await messagesGetByAgentIdUnSeen(user?.id!);

  const appointments = await appointmentGetAll();
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

  const formattedAgents: AgentSummaryColumn[] = [
    {
      id: "ghdklgdjknd",
      username: "Edna Mode",
      email: "EdnaMode@gmail.com",
      subscriptionExpires: "12-31-2029",
      balance: "100",
      leadsPending: "0",
      carrierViolations: "0",
    },
  ];

  const calls = await callGetAllByAgentId(user?.id!);

  const formatedCallHistory: CallHistoryColumn[] = calls.map((call) => ({
    id: call.id,
    agentName: call.agent.username!,
    phone: call.lead.cellPhone,
    direction: call.direction,
    fullName: `${call.lead.firstName} ${call.lead.lastName}`,
    email: call.lead.email,
    duration: call.duration!,
    date: call.createdAt,
  }));

  const outBoundCallsCount = calls.filter(
    (call) => call.direction === "Outbound"
  ).length;

  const inBoundCallsCount = calls.filter(
    (call) => call.direction === "Inbound"
  ).length;

  return (
    <DashBoardClient
      leadCount={leadCount}
      messagesCount={messagesCount}
      inBoundCallsCount={inBoundCallsCount}
      outBoundCallsCount={outBoundCallsCount}
      appointments={formattedAppointments}
      agents={formattedAgents}
      callHistory={formatedCallHistory}
    />
  );
};

export default DahsBoardPage;
