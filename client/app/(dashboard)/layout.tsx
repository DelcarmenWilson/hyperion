import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import NavBar from "@/components/navbar/navbar";
import { SideBar, SidebarSkeleton } from "@/components/reusable/sidebar";
import AppointmentContextComponent from "@/providers/app-component";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";
import { leadStatusGetAllByAgentIdDefault } from "@/actions/lead/status";
import { scriptGetOne } from "@/data/script";
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
    <div className="relative flex h-full flex-col">
      <NavBar />
      <main className="flex flex-1 h-[calc(100vh-3.6rem)] z-30 overflow-hidden">
        <Suspense fallback={<SidebarSkeleton />}>
          <SideBar main />
        </Suspense>
        <div className="flex flex-1 flex-col h-full ms-[70px] md:ms-0 ">
          <div className="flex flex-col flex-1 w-full  mt-14 px-1 lg:px-2 lg:mb-2 overflow-y-auto">
            <GlobalContextProvider
              initUser={initUser!}
              initStatus={status}
              intScript={script!}
              initLicenses={licenses}
              initAvailableCarriers={availableCarriers}
              initCarriers={carriers}
              initTemplates={templates}
            >
              <PhoneContextProvider initVoicemails={voicemails} token={token!}>
                <AppointmentContextComponent
                  initSchedule={schedule!}
                  initAppointments={appointments}
                  initLabels={appointmentLabels}
                >
                  {children}
                </AppointmentContextComponent>
              </PhoneContextProvider>
            </GlobalContextProvider>
          </div>
        </div>
      </main>
    </div>
  );
}
