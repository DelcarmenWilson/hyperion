import { userGetAll } from "@/data/user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberChange } from "./components/change-number";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { PhoneUpdate } from "./components/phone-update";

const MiscPage = async () => {
  const users = await userGetAll();

  return (
    <Card className="mt-2">
      <CardHeader>
        <Heading title={`Misc`} description="Misc Functions" />
        <Separator />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phoneChange" className="pt-2">
          <div>
            <TabsList className="w-full justify-start flex-wrap h-auto">
              <TabsTrigger value="phoneChange">PHONE CHANGE</TabsTrigger>
              <TabsTrigger value="phoneUpdate">PHONES UPDATE</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-2">
            <TabsContent value="phoneChange">
              <NumberChange users={users} />
            </TabsContent>
            <TabsContent value="phoneUpdate">
              <PhoneUpdate users={users} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MiscPage;
