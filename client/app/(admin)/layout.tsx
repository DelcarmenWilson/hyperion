import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import NavBar from "@/components/navbar/navbar";

import SideBar from "@/components/sidebar";

import { getAppointmentLabels, getAppointments } from "@/actions/appointment";
import { getTwilioToken } from "@/actions/twilio";

import { phoneSettingsGet } from "@/actions/settings/phone";
import { scheduleGet } from "@/actions/user/schedule";
import { voicemailGetUnHeard } from "@/actions/voicemail";
import { ALLADMINS } from "@/constants/user";
import ModalsContainer from "@/components/global/modals-container";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user) return null;
  const isAdmin = ALLADMINS.includes(user.role);

  if (!isAdmin) redirect("/dashboard");

  const voicemails = await voicemailGetUnHeard(user.id);
  const token = await getTwilioToken();
  const schedule = await scheduleGet();
  const appointments = await getAppointments();
  const appointmentLabels = await getAppointmentLabels();
  const phoneSettings = await phoneSettingsGet();

  return (
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
                {/* ///ALL THE PHONE MODALS */}
                <ModalsContainer />
              </AppointmentContextComponent>
            </PhoneContextProvider>
          </div>
        </div>
      </div>
    </SocketContextComponent>
  );
};

export default AdminLayout;
