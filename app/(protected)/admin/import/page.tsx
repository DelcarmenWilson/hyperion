import { PageLayoutAdmin } from "../../components/page-layout";
import { ImportClient } from "./components/client";

const ImportPage = () => {
  return (
    <PageLayoutAdmin title="Import data" description="">
      <ImportClient />
    </PageLayoutAdmin>
  );
};

export default ImportPage;
