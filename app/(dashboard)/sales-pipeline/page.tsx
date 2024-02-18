import { currentUser } from "@/lib/auth";
import { SalesClient } from "./components/client";
import { leadsGetAllByAgentId } from "@/data/lead";

const SalesPage = async () => {
  const user = await currentUser();
  const leads = await leadsGetAllByAgentId(user?.id!);
  return (
    <>
      <SalesClient data={leads} />
    </>
  );
};

export default SalesPage;
