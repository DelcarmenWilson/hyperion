import NavBar from "@/components/navbar";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashBoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
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
    <div className="flex flex-col h-full ">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1">
          {/* <SideBar /> */}
          <div className=" flex-1 bg-white w-full space-y-4 p-8 pt-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
