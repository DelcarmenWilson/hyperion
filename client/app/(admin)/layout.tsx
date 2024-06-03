import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { SideBar, SidebarSkeleton } from "@/components/reusable/sidebar";
import { currentRole } from "@/lib/auth";
import NavBar from "@/components/navbar";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};
const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const role = await currentRole();

  if (role != "MASTER" && role != "ADMIN") {
    redirect("/dashboard");
  }
  return (
    <>
      {/* <SideBar />
      <div className="flex flex-col ml-[70px] h-full ">
        <div className="flex flex-col flex-1 w-full lg:px-4 lg:mb-4 overflow-hidden overflow-y-auto">
          {children}
        </div>
      </div> */}
      <div className="relative flex h-full flex-col">
        <NavBar />
        <main className="flex flex-1 h-[calc(100vh-3.6rem)] z-30 overflow-hidden">
          <Suspense fallback={<SidebarSkeleton />}>
            <SideBar />
          </Suspense>
          <div className="flex flex-1 flex-col h-full">
            <div className="flex flex-col flex-1 w-full mt-14 px-1 lg:px-2 lg:mb-2 overflow-y-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProtectedLayout;
