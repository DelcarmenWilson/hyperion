import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

import NavBar from "@/components/navbar";
import {
  MainSideBar,
  MainSidebarSkeleton,
} from "@/components/reusable/main-sidebar";
import AppointmentProvider from "@/providers/appointment-provider";
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
      <Suspense fallback={<MainSidebarSkeleton />}>
        <MainSideBar />
      </Suspense>
      <div className="flex flex-col ml-[70px] h-full ">
        <NavBar />
        {/* <ScrollArea className="flex flex-col flex-1 w-full px-4 mb-4"> */}
        <div className="flex flex-col flex-1 w-full px-4 mb-4 overflow-hidden overflow-y-auto">
          <PhoneContextProvider>
            <AppointmentProvider>{children}</AppointmentProvider>
          </PhoneContextProvider>
        </div>
        {/* </ScrollArea> */}
      </div>
    </>
  );
}
