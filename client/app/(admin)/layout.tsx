import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";
import NavBar from "@/components/navbar/navbar";

import { ChatDrawer } from "@/components/chat/drawer";
import { LoginStatusModal } from "@/components/login-status/modal";
import SideBar from "@/components/sidebar";

import {
  appointmentLabelsGetAll,
  appointmentsGetAll,
} from "@/actions/appointment";
import { getTwilioToken } from "@/actions/twilio";

import { phoneSettingsGet } from "@/actions/settings/phone";
import { scheduleGet } from "@/actions/user/schedule";
import { voicemailGetUnHeard } from "@/actions/voicemail";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) return null;
  const isAdmin = ["MASTER", "ADMIN", "SUPER_ADMIN"].includes(user.role);

  if (!isAdmin) redirect("/dashboard");

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
          <NavBar admin />
          <div className="flex flex-1 w-full h-full overflow-hidden">
            <SideBar />
            <div className="flex flex-col flex-1 h-full w-full p-2 bg-secondary overflow-hidden">
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
                  {children}
                </AppointmentContextComponent>
              </PhoneContextProvider>
              <ChatDrawer />
              <LoginStatusModal />
            </div>
          </div>
        </div>
      </SocketContextComponent>
    </GlobalContextProvider>
  );
};

export default AdminLayout;
