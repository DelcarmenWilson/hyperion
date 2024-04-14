import { CarTaxiFront } from "lucide-react";

import { PageLayout } from "@/components/custom/layout/page-layout";

import { adminRoadmapGetById } from "@/data/admin";
import { RoadmapForm } from "./components/form";

const RoadmapIdPage = async ({ params }: { params: { id: string } }) => {
  const roadmap = await adminRoadmapGetById(params.id);
  if (!roadmap) return null;
  return (
    <PageLayout
      title={`Roadmap Task - ${roadmap.headLine} | Status:${roadmap.status}`}
      icon={CarTaxiFront}
    >
      <RoadmapForm roadmap={roadmap} />
    </PageLayout>
  );
};

export default RoadmapIdPage;
