import { UserSquare } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page";
import { PipeLineList } from "./components/pipeline/list";
import { TopMenu } from "./components/top-menu";

const SalesPage = () => {
  return (
    <PageLayout title="Sales Pipeline" icon={UserSquare} topMenu={<TopMenu />}>
      <PipeLineList />
    </PageLayout>
  );
};

export default SalesPage;
