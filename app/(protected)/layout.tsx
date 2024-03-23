import React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/sidebar";
import { currentRole } from "@/lib/auth";

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
