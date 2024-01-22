import React from "react";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

import NavBar from "@/components/navbar";
import { MainSideBar } from "@/components/reusable/main-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function DashBoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const organization = await db.organization.findFirst({
    where: {
      id: params.organizationId,
      userId: user.id,
    },
  });

  if (!organization) {
    redirect("/");
  }

  return (
    <>
      <MainSideBar />
      <div className="flex flex-col ml-[70px] h-full ">
        <NavBar />
        <ScrollArea className="w-full px-4">
          {/* <div className="flex flex-1 flex-col overflow-hidden w-full space-y-4 p-8 pt-2 overflow-y-auto"> */}
          {children}
          {/* </div> */}
        </ScrollArea>
      </div>
    </>
  );
}
