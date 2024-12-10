import { UserSquare } from "lucide-react";

import { TopMenu } from "./_components/top-menu";
import { PageLayout } from "@/components/custom/layout/page";
import { PipeLineList } from "./_components/pipeline/list";

const SalesPage = () => {
  return (
    <PageLayout title="Sales Pipeline" icon={UserSquare} topMenu={<TopMenu />}>
      <PipeLineList />
    </PageLayout>
  );
};

export default SalesPage;
