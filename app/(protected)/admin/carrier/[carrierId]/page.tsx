import { adminCarrierGetById, adminCarriersGetAll } from "@/data/admin";

import { PageLayoutAdmin } from "@/components/custom/page-layout-admin";
import { TopMenu } from "./components/top-menu";
import { CarrierForm } from "./components/form";

const TeamPage = async ({
  params,
}: {
  params: {
    carrierId: string;
  };
}) => {
  const carriers = await adminCarriersGetAll();
  const carrier = await adminCarrierGetById(params.carrierId);

  if (!carrier) {
    return null;
  }

  return (
    <PageLayoutAdmin
      title={`${carrier.name}`}
      description=""
      topMenu={<TopMenu carriers={carriers} carrierId={carrier.id} />}
    >
      <CarrierForm carrier={carrier} />
    </PageLayoutAdmin>
  );
};

export default TeamPage;
