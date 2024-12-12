import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Calling from "./calling";

const Features = () => {
  return (
    <div className="pt-10">
      <p className="text-pink-500 text-3xl font-bold text-center font-grotesk">
        Product Features
      </p>
      <p className="text-white text-5xl font-bold text-center font-ubuntu">
        How Ringy Works
      </p>

      <Tabs defaultValue="calling">
        <div className="container">
          <TabsList className="bg-transparent text-white justify-center w-full">
            <TabsTrigger
              value="calling"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              CALLING
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              EMAIL & SMS
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              MARKETING
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              SALES
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              AUTOMATION
            </TabsTrigger>
            <TabsTrigger
              value="mobileapp"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              MOBILEAPP
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              INTEGRATIONS
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline"
            >
              PRIVACY & SECURITY
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="text-white">
          <TabsContent value="calling">
            <Calling/>
          </TabsContent>
          <TabsContent value="email">This is the email tab</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Features;
