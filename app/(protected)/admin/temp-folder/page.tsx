import path from "path";
import fs from "fs";

import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { TempFolderClient } from "./components/client";

const UsersPage = async () => {
  const images = fs.readdirSync(path.join("public/assets/temp"));
  return (
    <PageLayoutAdmin
      title="Hyperion Leads"
      description="Manage all Hyperion Leads"
    >
      <TempFolderClient initImages={images} />
    </PageLayoutAdmin>
  );
};

export default UsersPage;
