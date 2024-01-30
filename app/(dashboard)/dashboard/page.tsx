import { currentUser } from "@/lib/auth";
import { MessageSquareText, Phone, PhoneIncoming, Users } from "lucide-react";
import { Box } from "./components/box";
import { AppointmentBox } from "./components/appointment/appointment-box";
import { AppointmentColumn } from "./components/appointment/columns";
import { AgentSummary } from "./components/agentsummary/agent-summary";
import { AgentSummaryColumn } from "./components/agentsummary/columns";
import { CallHistoryColumn } from "./components/callhistory/columns";
import { CallHistory } from "./components/callhistory/call-history";

import { appointmentsGetAllByUserId } from "@/data/appointment";
import { callGetAllByAgentId } from "@/data/call";
import { messagesGetByAgentIdUnSeen } from "@/data/message";
import { leadsGetByAgentIdTodayCount } from "@/data/lead";

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
    agentName: user?.name!,
    phone: call.lead?.cellPhone,
    direction: call.direction,
    fullName: `${call.lead?.firstName} ${call.lead?.lastName}`,
    email: call.lead?.email,
    duration: call.duration!,
    date: call.createdAt,
    recordUrl: call.recordUrl as string,
  }));

  const outBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "outbound"
  ).length;

  const inBoundCallsCount = calls.filter(
    (call) => call.direction.toLowerCase() === "inbound"
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <Box
          icon={Users}
          title="Leads today"
          value={leadCount as number}
          href="/leads"
          hrefTitle="Go to leads"
        />

        <Box
          icon={MessageSquareText}
          title="New texts"
          value={messagesCount}
          href="/inbox"
          hrefTitle="Go to inbox"
        />

        <Box
          icon={Phone}
          title="Outbound calls"
          value={outBoundCallsCount}
          href="/calls"
          hrefTitle="Go to calls"
        />
        <Box
          icon={PhoneIncoming}
          title="Inbound calls"
          value={inBoundCallsCount}
          href="/calls"
          hrefTitle="Go to calls"
        />
      </div>
      <AppointmentBox data={formattedAppointments} />
      <AgentSummary data={formattedAgents} />
      <div className="flex items-center gap-4 h-[400px]">
        <div className="border border-[#FF0000] w-[25%] h-full">Turn over</div>
        <div className="w-[75%] h-full">
          <CallHistory data={formatedCallHistory} />
        </div>
      </div>
    </div>
  );
};

export default DahsBoardPage;
