import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { usersGetAllChat } from "@/actions/user";

import SocketContextComponent from "@/providers/socket-component";

import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";
import NavBar from "@/components/navbar/navbar";

import { ChatDrawer } from "@/components/chat/drawer";
import { LoginStatusModal } from "@/components/login-status/modal";
import SideBar from "@/components/sidebar";

import { leadStatusGetAllDefault } from "@/actions/lead/status";
import { scriptGetOne } from "@/actions/script";
import {
  userCarriersGetAllByUserId,
  userGetByIdDefault,
  userLicensesGetAllByUserId,
  userTemplatesGetAllByUserId,
} from "@/data/user";
import { voicemailGetUnHeard } from "@/actions/voicemail";
import { scheduleGetByUserId } from "@/actions/schedule";
import {
  appointmentLabelsGetAllByUserId,
  appointmentsGetAllByUserId,
} from "@/data/appointment";

import { adminCarriersGetAll } from "@/actions/admin/carrier";
import { getTwilioToken } from "@/actions/twilio";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user?.role != "MASTER" && user?.role != "ADMIN") {
    redirect("/dashboard");
  }
  const initUser = await userGetByIdDefault(user.id);
  const initUsers = await usersGetAllChat();
  const status = await leadStatusGetAllDefault();
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
          <SideBar />
          <div className="flex flex-col flex-1">
            <NavBar />
            <div className="flex flex-1 h-full w-full p-2 bg-secondary overflow-hidden">
              <PhoneContextProvider initVoicemails={voicemails} token={token!}>
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

export default ProtectedLayout;
