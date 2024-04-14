import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { adminRoadmapsGetAll } from "@/data/admin";
import { RoadmapClient } from "./components/client";

const RoadmapPage = async () => {
  const roadmaps = await adminRoadmapsGetAll();

  return (
    <PageLayoutAdmin
      title="Roadmap"
      description="Manage Hyperion Roadmap (Tasks)"
    >
      <RoadmapClient initRoadmaps={roadmaps} />
    </PageLayoutAdmin>
  );
};

export default RoadmapPage;
