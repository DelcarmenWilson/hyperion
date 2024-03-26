import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { ImportClient } from "./components/client";

const ImportPage = () => {
  return (
    <PageLayoutAdmin title="Import data" description="">
      <ImportClient />
    </PageLayoutAdmin>
  );
};

export default ImportPage;
