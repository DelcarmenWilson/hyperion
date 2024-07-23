import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurPage from "@/components/global/blur-page";

import FunnelSteps from "./components/steps";

import { funnelGetById } from "@/actions/funnel";

const FunnelPage = async ({ params }: { params: { funnelId: string } }) => {
  const funnelPages = await funnelGetById(params.funnelId);
  if (!funnelPages) return redirect("/funnels");

  return (
    <BlurPage>
      <Link
        href={"/funnels"}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        Back
      </Link>
      <h1 className="text-3xl mb-8">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            pages={funnelPages.funnelPages}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">Settings shoud go here</TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelPage;
