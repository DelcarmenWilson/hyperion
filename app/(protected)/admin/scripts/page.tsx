import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { ScriptsClient } from "./components/client";
import { scriptsGetAll } from "@/data/script";

const ScriptsPage = async () => {
  const scripts = await scriptsGetAll();
  return (
    <PageLayoutAdmin
      title={"Scripts"}
      description="Manage Scripts"
      scroll={false}
    >
      <ScriptsClient intialScripts={scripts} />
    </PageLayoutAdmin>
  );
};

export default ScriptsPage;
