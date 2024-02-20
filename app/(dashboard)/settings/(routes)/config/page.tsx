import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { LeadStatusBox } from "@/components/lead/lead-status";
import { leadStatusGetAllByAgentId } from "@/data/lead";
import { currentUser } from "@/lib/auth";

const ConfigPage = async () => {
  const user = await currentUser();
  const leadStatus = await leadStatusGetAllByAgentId(user?.id!);
  return (
    <PageLayoutAdmin title="" description="">
      <LeadStatusBox leadStatus={leadStatus} />
    </PageLayoutAdmin>
  );
};

export default ConfigPage;
