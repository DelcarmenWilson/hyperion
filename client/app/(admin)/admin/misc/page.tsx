import { PageLayoutAdmin } from "@/components/custom/layout/page-admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberChange } from "./components/change-number";
import { PhoneUpdate } from "./components/phone-update";
import { EmailConfirm } from "./components/email-confimation";

import { adminUsersGetAll } from "@/actions/admin/user";

const MiscPage = async () => {
  const users = await adminUsersGetAll();
  const user = users[0].id;

  return (
    <PageLayoutAdmin
      title={`Misc`}
      description="Misc Functions"
      topMenu="This page is no longer needed"
    >
      <Tabs defaultValue="phoneChange" className="h-full flex">
        <TabsList className="flex flex-col justify-start items-start gap-2 h-full">
          <TabsTrigger value="phoneChange">PHONE CHANGE</TabsTrigger>
          <TabsTrigger value="phoneUpdate">PHONES UPDATE</TabsTrigger>
          <TabsTrigger value="emailConfirm">EMAIL CONFIRM</TabsTrigger>
        </TabsList>

        <div className="flex-1 px-2">
          <div className="container">
            <TabsContent value="phoneChange">
              <NumberChange user={user} />
            </TabsContent>
            <TabsContent value="phoneUpdate">
              <PhoneUpdate user={user} />
            </TabsContent>
            <TabsContent value="emailConfirm">
              <EmailConfirm user={user} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default MiscPage;
