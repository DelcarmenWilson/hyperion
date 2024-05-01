import path from "path";
import fs from "fs";

import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { TempFolderClient } from "./components/client";
import { TempFolderTopMenu } from "./components/top-menu";

type TempFolderPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const TempFolderPage = async ({ searchParams }: TempFolderPageProps) => {
  const folder = (searchParams.folder as string) || "temp";
  const images = fs.readdirSync(path.join(`public/assets/${folder}`));
  return (
    <PageLayoutAdmin
      title={folder}
      description="Manage all Folders"
      topMenu={<TempFolderTopMenu />}
    >
      <TempFolderClient folder={folder} initImages={images} />
    </PageLayoutAdmin>
  );
};

export default TempFolderPage;
