import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";

import NavBar from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";

import ModalsContainer from "@/components/global/modals-container";
import ModalProvider from "@/providers/modal";

import { voicemailGetUnHeard } from "@/actions/voicemail";
import { scheduleGet } from "@/actions/user/schedule";
import {
  appointmentLabelsGetAll,
  appointmentsGetAll,
} from "@/actions/appointment";

import { getTwilioToken } from "@/actions/twilio";
import { phoneSettingsGet } from "@/actions/settings/phone";
import ChatBot from "@/components/global/chat-bot/chat-bot";
import { devAdmins } from "@/constants/page-routes";
export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const voicemails = await voicemailGetUnHeard(user.id);
  const token = await getTwilioToken();
  const schedule = await scheduleGet();
  const appointments = await appointmentsGetAll();
  const appointmentLabels = await appointmentLabelsGetAll();
  const phoneSettings = await phoneSettingsGet();

  return (
    <GlobalContextProvider>
      <SocketContextComponent>
        <div className="flex flex-col h-screen w-full overflow-hidden">
          <NavBar />
          <div className="flex flex-1 w-full h-full overflow-hidden shrink-0">
            <SideBar main />
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
                </AppointmentContextComponent>
              </PhoneContextProvider>
              {/*  THE GLOBAL CHAT BOT ASSISTANT */}
              {devAdmins.includes(user.role) && <ChatBot />}
            </div>
          </div>
        </div>
      </SocketContextComponent>
    </GlobalContextProvider>
  );
}
