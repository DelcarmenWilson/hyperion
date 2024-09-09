import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";

import BlurPage from "@/components/global/blur-page";
import NavBar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";
import { ChatDrawer } from "@/components/chat/drawer";
import { LoginStatusModal } from "@/components/login-status/modal";

import { leadStatusGetAllByAgentIdDefault } from "@/actions/lead/status";
import { scriptGetOne } from "@/actions/script";
import {
  userCarriersGetAllByUserId,
  userGetByIdDefault,
  userLicensesGetAllByUserId,
  userTemplatesGetAllByUserId,
} from "@/data/user";
import { voicemailGetUnHeard } from "@/actions/voicemail";
import { scheduleGetByUserId } from "@/data/schedule";
import {
  appointmentLabelsGetAllByUserId,
  appointmentsGetAllByUserId,
} from "@/data/appointment";

import { adminCarriersGetAll } from "@/actions/admin/carrier";
import { getTwilioToken } from "@/actions/twilio";
import { usersGetAllChat } from "@/actions/user";
import ModalProvider from "@/providers/modal";
import { GroupMessageCard } from "@/components/global/group-message-card";
export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }
  const initUser = await userGetByIdDefault(user.id);
  const initUsers = await usersGetAllChat();
  const status = await leadStatusGetAllByAgentIdDefault(user.id);
  const script = await scriptGetOne();
  const voicemails = await voicemailGetUnHeard(user.id);
  const token = await getTwilioToken();
  const licenses = await userLicensesGetAllByUserId(user.id);
  const carriers = await userCarriersGetAllByUserId(user.id);
  const availableCarriers = await adminCarriersGetAll();
  const schedule = await scheduleGetByUserId(user.id, user.role);
  const appointments = await appointmentsGetAllByUserId(user.id);
  const appointmentLabels = await appointmentLabelsGetAllByUserId(user.id);
  const templates = await userTemplatesGetAllByUserId(user.id);

  return (
    <GlobalContextProvider
      initUser={initUser!}
      initUsers={initUsers}
      initStatus={status}
      intScript={script!}
      initLicenses={licenses}
      initAvailableCarriers={availableCarriers}
      initCarriers={carriers}
      initTemplates={templates}
    >
      <SocketContextComponent>
        <div className="flex h-screen w-full overflow-hidden">
          <SideBar main />

          <div className="flex flex-col flex-1 w-[calc(100%-101px)] shrink-0">
            <NavBar />
            <div className="flex flex-1 h-full w-full p-2 bg-secondary overflow-hidden">
              <PhoneContextProvider initVoicemails={voicemails} token={token!}>
                <AppointmentContextComponent
                  initSchedule={schedule!}
                  initAppointments={appointments}
                  initLabels={appointmentLabels}
                >
                  <ModalProvider>{children}</ModalProvider>
                </AppointmentContextComponent>
              </PhoneContextProvider>

              <ChatDrawer />
              <GroupMessageCard />
              <LoginStatusModal />
            </div>
          </div>
        </div>
      </SocketContextComponent>
    </GlobalContextProvider>
  );
}
