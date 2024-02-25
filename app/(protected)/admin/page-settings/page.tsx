<<<<<<< HEAD
=======
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/custom/heading";
>>>>>>> parent of 640c050 (sales-pipeline)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarrierBox } from "./components/carrier-box";

const PageSettings = () => {
  return (
    <Card className="mt-2 h-full">
      <CardHeader>
        <Heading title={"Page Settings"} description="Manage page settings." />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carriers" className="pt-2">
          <TabsList>
            <TabsTrigger value="carriers">Carriers</TabsTrigger>
          </TabsList>
          <div className="px-2">
            <TabsContent value="carriers">
              <CarrierBox />
            </TabsContent>
            {/* <TabsContent value="chatSettings">ChatSettingsBox</TabsContent> */}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PageSettings;
