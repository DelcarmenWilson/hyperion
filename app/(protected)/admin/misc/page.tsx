import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberChange } from "./components/change-number";
import { PhoneUpdate } from "./components/phone-update";
import { EmailConfirm } from "./components/email-confimation";
import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { adminLeadStatusGetAll, adminUsersGetAll } from "@/actions/admin";
import { LeadStatusBox } from "@/components/lead/lead-status";

const MiscPage = async () => {
  const users = await adminUsersGetAll();
  const leadstatus = await adminLeadStatusGetAll();

  return (
    <PageLayoutAdmin title={`Misc`} description="Misc Functions">
      <Tabs defaultValue="phoneChange" className="pt-2">
        <div>
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="phoneChange">PHONE CHANGE</TabsTrigger>
            <TabsTrigger value="phoneUpdate">PHONES UPDATE</TabsTrigger>
            <TabsTrigger value="emailConfirm">EMAIL CONFIRM</TabsTrigger>
            <TabsTrigger value="leadStatus">LEAD STATUS</TabsTrigger>
          </TabsList>
        </div>

        <div className="px-2">
          <TabsContent value="phoneChange">
            <NumberChange users={users} />
          </TabsContent>
          <TabsContent value="phoneUpdate">
            <PhoneUpdate users={users} />
          </TabsContent>
          <TabsContent value="emailConfirm">
            <EmailConfirm users={users} />
          </TabsContent>
          <TabsContent value="leadStatus">
            <LeadStatusBox leadStatus={leadstatus} />
          </TabsContent>
        </div>
      </Tabs>
    </PageLayoutAdmin>
  );
};

export default MiscPage;
