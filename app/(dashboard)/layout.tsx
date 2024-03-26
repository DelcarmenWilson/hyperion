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
import { voicemailGetUnHeard } from "@/data/voicemail";
import { getTwilioToken } from "@/data/verification-token";
import { scheduleGetByUserId } from "@/data/schedule";
import { appointmentsGetAllByUserIdUpcoming } from "@/data/appointment";

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
    <>
      <Suspense fallback={<MainSidebarSkeleton />}>
        <MainSideBar />
      </Suspense>
      <div className="flex flex-col ml-[70px] h-full ">
        <NavBar />
        {/* <ScrollArea className="flex flex-col flex-1 w-full px-4 mb-4"> */}
        <div className="flex flex-col flex-1 w-full lg:px-4 lg:mb-4 overflow-hidden overflow-y-auto">
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
        {/* </ScrollArea> */}
      </div>
    </>
  );
}
