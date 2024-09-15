import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";

import NavBar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";
import { ChatDrawer } from "@/components/chat/drawer";
import { LoginStatusModal } from "@/components/login-status/modal";

import { voicemailGetUnHeard } from "@/actions/voicemail";
import { scheduleGetByUserId } from "@/actions/user/schedule";
import {
  appointmentLabelsGetAll,
  appointmentsGetAll,
} from "@/data/appointment";

import { getTwilioToken } from "@/actions/twilio";
import { usersGetAllChat } from "@/actions/user";
import ModalProvider from "@/providers/modal";
import { GroupMessageCard } from "@/components/global/group-message-card";
import ModalsContainer from "@/components/global/modals-container";

import { phoneSettingsGet } from "@/actions/settings/phone";
export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }
  const initUsers = await usersGetAllChat();
  const voicemails = await voicemailGetUnHeard(user.id);
  const token = await getTwilioToken();
  const schedule = await scheduleGetByUserId(user.id, user.role);
  const appointments = await appointmentsGetAll();
  const appointmentLabels = await appointmentLabelsGetAll();
  const phoneSettings = await phoneSettingsGet();

  return (
    <GlobalContextProvider initUsers={initUsers}>
      <SocketContextComponent>
        <div className="flex h-screen w-full overflow-hidden">
          <SideBar main />

          <div className="flex flex-col flex-1 w-[calc(100%-101px)] shrink-0">
            <NavBar />
            <div className="flex flex-1 h-full w-full p-2 bg-secondary overflow-hidden">
              <PhoneContextProvider
                initVoicemails={voicemails}
                token={token!}
                settings={phoneSettings!}
              >
                <AppointmentContextComponent
                  initSchedule={schedule!}
                  initAppointments={appointments}
                  initLabels={appointmentLabels}
                >
                  <ModalProvider>{children}</ModalProvider>
                  {/* ///ALL THE PHONE MODALS */}
                  <ModalsContainer />
                  <ChatDrawer />
                  <GroupMessageCard />
                  <LoginStatusModal />
                </AppointmentContextComponent>
              </PhoneContextProvider>
            </div>
          </div>
        </div>
      </SocketContextComponent>
    </GlobalContextProvider>
  );
}
