import React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/sidebar";
import { currentRole } from "@/lib/auth";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};
const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const role = await currentRole();

  if (role == "USER") {
    redirect("/dashboard");
  }
  return (
    // <div className="h-full w-full flex gap-y-5 items-center justify-center ">
    //   <div className="w-[150px] h-full p-2">
    //     <AdminSidebar />
    //   </div>
    //   <div className="flex-1 h-full w-full border bg-background m-4 p-2 ">
    //     {children}
    //   </div>
    // </div>

    <>
      <AdminSidebar />
      <div className="flex flex-col ml-[70px] h-full ">
        {/* <ScrollArea className="flex flex-col flex-1 w-full px-4 mb-4"> */}
        <div className="flex flex-col flex-1 w-full px-4 mb-4 overflow-hidden overflow-y-auto">
          {children}
        </div>
        {/* </ScrollArea> */}
      </div>
    </>
  );
};

export default ProtectedLayout;
