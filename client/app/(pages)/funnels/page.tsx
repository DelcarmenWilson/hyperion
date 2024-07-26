import React from "react";
import { Plus } from "lucide-react";

import BlurPage from "@/components/global/blur-page";
import { funnelsGetAll } from "@/actions/funnel";
import FunnelsDataTable from "./components/data-table";
import { columns } from "./components/column";
import FunnelForm from "./components/form";

const Funnels = async () => {
  const funnels = await funnelsGetAll();
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={<FunnelForm />}
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default Funnels;
