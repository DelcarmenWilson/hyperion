import React from "react";
import Calling from "./calling";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureContent } from "./constants";
import FeatureLayout from "./feature-layout";

const Features = () => {
  return (
    <div className="bg-hero pt-10">
      <p className="text-pink-500 text-3xl font-bold text-center font-grotesk">
        Product Features
      </p>
      <p className="text-white text-5xl font-bold text-center font-ubuntu m-t-4 mb-6">
        How Hyperion Works
      </p>

      <Tabs defaultValue="calling">
        <div className="container">
          <TabsList className="bg-transparent text-white justify-center w-full gap-7 mb-10">
            {FeatureContent.map((item) => (
              <TabsTrigger
                key={item.type}
                value={item.type}
                className="data-[state=active]:bg-transparent data-[state=active]:text-pink-500 data-[state=active]:underline uppercase font-bold"
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="text-white">
          <TabsContent value="calling">
            <Calling />
          </TabsContent>
          {FeatureContent.map((item) => (
            <TabsContent key={item.type} value={item.type}>
              <FeatureLayout {...item} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default Features;
