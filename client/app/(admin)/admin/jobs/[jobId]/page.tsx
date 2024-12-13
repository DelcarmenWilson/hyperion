import { LoadingCard } from "@/components/reusable/loading-card";
import NewEmptyCard from "@/components/reusable/new-empty-card";
import { Briefcase } from "lucide-react";

const JobPage = () => {
  // return <NewEmptyCard icon={Briefcase} title="Select a mini job" />;
  return <LoadingCard title="Select a mini job" />;
};

export default JobPage;
