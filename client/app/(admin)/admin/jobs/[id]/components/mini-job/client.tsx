import { Plus } from "lucide-react";
import { useJobStore } from "../../../hooks/use-store";

import { Button } from "@/components/ui/button";
import { MiniJobList } from "./list";

const MiniJobClient = () => {
  const { onMiniJobFormOpen } = useJobStore();
  return (
    <div className="px-2">
      <div className="flex justify-between">
        <p>Mini Jobs</p>
        <Button size="sm" onClick={onMiniJobFormOpen}>
          <Plus size={16} />
        </Button>
      </div>
      <MiniJobList />
    </div>
  );
};

export default MiniJobClient;
