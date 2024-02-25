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
<<<<<<< HEAD
=======
import { AppointmentProvider } from "@/providers/appointment-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
>>>>>>> parent of 9f16759 (sales-pipeline)
=======
import { ScrollArea } from "@/components/ui/scroll-area";
>>>>>>> parent of 640c050 (sales-pipeline)
import PhoneContextProvider from "@/providers/phone-provider";

export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
<<<<<<< HEAD
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
=======
      <PhoneContextProvider>
        <AppointmentProvider>
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
        </AppointmentProvider>
      </PhoneContextProvider>
>>>>>>> parent of 640c050 (sales-pipeline)
    </>
  );
}
