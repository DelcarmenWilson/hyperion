import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PresetClient } from "./components/preset/preset-client";

const SmsPage = () => {
  return (
    <>
      {/* ACTIVITY */}
      <Tabs defaultValue="preset">
        <TabsList className="w-full flex-wrap h-auto gap-4">
          <TabsTrigger value="preset">PRESET TEXTS</TabsTrigger>
          <TabsTrigger value="drip">DRIP MARKETING</TabsTrigger>
          <TabsTrigger value="keyworkds">KEYWORDS</TabsTrigger>

          <TabsTrigger value="replies">PRESET REPLIES</TabsTrigger>
          <TabsTrigger value="replies">PRESET REPLIES</TabsTrigger>
        </TabsList>

        <div className="px-2">
          <TabsContent value="preset">
            <PresetClient />
          </TabsContent>
          <TabsContent value="drip">DRIP MARKETING</TabsContent>
          <TabsContent value="keyworkds">KEYWORDS</TabsContent>
          <TabsContent value="replies">PRESET REPLIES </TabsContent>
          <TabsContent value="subscribe">SUNSCRIPTION PAGE</TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default SmsPage;
