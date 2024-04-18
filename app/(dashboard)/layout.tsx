import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import NavBar from "@/components/navbar";
import {
  MainSideBar,
  MainSidebarSkeleton,
} from "@/components/reusable/main-sidebar";
import AppointmentProvider from "@/providers/appointment";
import PhoneContextProvider from "@/providers/phone";
import GlobalContextProvider from "@/providers/global";
import { leadStatusGetAllByAgentIdDefault } from "@/data/lead";
import { scriptGetOne } from "@/data/script";
import { userGetByIdDefault, userLicensesGetAllByUserId } from "@/data/user";
import { voicemailGetUnHeard } from "@/actions/voicemail";
import { scheduleGetByUserId } from "@/data/schedule";
import { appointmentsGetAllByUserIdUpcoming } from "@/data/appointment";
import { getTwilioToken } from "@/data/verification-token";

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
  const token = await getTwilioToken(user.id);
  const licenses = await userLicensesGetAllByUserId(user.id);
  const schedule = await scheduleGetByUserId(user.id, user.role);
  const appointments = await appointmentsGetAllByUserIdUpcoming(
    user.id,
    user.role
  );

  return (
    <div className="relative flex h-full flex-col">
      <NavBar />
      <main className="flex flex-1 h-[calc(100vh-3.6rem)] z-30 overflow-hidden">
        <Suspense fallback={<MainSidebarSkeleton />}>
          <MainSideBar main />
        </Suspense>
        <div className="flex flex-1 flex-col h-full">
          <div className="flex flex-col flex-1 w-full px-1 lg:px-2 lg:mb-2 overflow-y-auto">
            <GlobalContextProvider
              initUser={initUser!}
              initStatus={status}
              intScript={script!}
              initLicenses={licenses}
            >
              <PhoneContextProvider initVoicemails={voicemails} token={token!}>
                <AppointmentProvider
                  initSchedule={schedule!}
                  initAppointments={appointments}
                >
                  {children}
                </AppointmentProvider>
              </PhoneContextProvider>
            </GlobalContextProvider>
          </div>
        </div>
      </main>
    </div>
  );
}
