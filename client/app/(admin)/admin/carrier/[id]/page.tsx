import {
  adminCarrierGetById,
  adminCarriersGetAll,
  adminCarrierConditionsGetAllByCarrierId,
} from "@/data/admin";

import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { TopMenu } from "./components/top-menu";
import { CarrierForm } from "./components/form";
import { CarrierConditionClient } from "./components/carrier-condition/client";

const CarrierPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const carriers = await adminCarriersGetAll();
  const carrier = await adminCarrierGetById(params.id);
  const carrierConditions = await adminCarrierConditionsGetAllByCarrierId(
    params.id
  );

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
      <CarrierConditionClient
        initCarrierConditions={carrierConditions}
        carrier={carrier}
      />
    </PageLayoutAdmin>
  );
};

export default CarrierPage;
