import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import NavBar from "@/components/navbar";
import {
  MainSideBar,
  MainSidebarSkeleton,
} from "@/components/reusable/main-sidebar";
<<<<<<< HEAD
import AppointmentProvider from "@/providers/appointment-provider";
=======
import { AppointmentProvider } from "@/providers/appointment-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
>>>>>>> parent of 9f16759 (sales-pipeline)
import PhoneContextProvider from "@/providers/phone-provider";
import GlobalContextProvider from "@/providers/global-provider";
import { leadStatusGetAllByAgentIdDefault } from "@/data/lead";
import { scriptGetOne } from "@/data/script";
import { userGetByIdDefault, userLicensesGetAllByUserId } from "@/data/user";
import { voicemailGetUnHeard } from "@/data/voicemail";
import { getTwilioToken } from "@/data/verification-token";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const initUser = await userGetByIdDefault(user?.id!);
  const status = await leadStatusGetAllByAgentIdDefault(user?.id!);
  const script = await scriptGetOne();
  const voicemails = await voicemailGetUnHeard(user?.id!);
  const token = await getTwilioToken(user?.id!);
  const licenses = await userLicensesGetAllByUserId(user?.id!);

  if (!user) {
    redirect("/login");
  }

  return (
    <>
<<<<<<< HEAD
      <Suspense fallback={<MainSidebarSkeleton />}>
        <MainSideBar />
      </Suspense>
      <div className="flex flex-col ml-[70px] h-full ">
        <NavBar />
        {/* <ScrollArea className="flex flex-col flex-1 w-full px-4 mb-4"> */}
        <div className="flex flex-col flex-1 w-full px-4 mb-4 overflow-hidden overflow-y-auto">
          <GlobalContextProvider
            initUser={initUser!}
            initStatus={status}
            intScript={script!}
            initLicenses={licenses}
          >
            <PhoneContextProvider initVoicemails={voicemails} token={token!}>
              <AppointmentProvider>{children}</AppointmentProvider>
            </PhoneContextProvider>
          </GlobalContextProvider>
        </div>
        {/* </ScrollArea> */}
      </div>
=======
      <PhoneContextProvider>
        <AppointmentProvider />
        <Suspense fallback={<MainSidebarSkeleton />}>
          <MainSideBar />
        </Suspense>
        <div className="flex flex-col ml-[70px] h-full ">
          <NavBar />
          {/* <ScrollArea className="flex flex-col flex-1 w-full px-4 mb-4"> */}
          <div className="flex flex-col flex-1 w-full px-4 mb-4 overflow-hidden overflow-y-auto">
            {children}
          </div>
          {/* </ScrollArea> */}
        </div>
      </PhoneContextProvider>
>>>>>>> parent of 9f16759 (sales-pipeline)
    </>
  );
}
