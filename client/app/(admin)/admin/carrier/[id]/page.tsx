import { PageLayoutAdmin } from "@/components/custom/layout/page-layout-admin";
import { TopMenu } from "./components/top-menu";
import { CarrierForm } from "./components/form";
import { CarrierConditionClient } from "./components/carrier-condition/client";

import {
  adminCarrierGetById,
  adminCarriersGetAll,
} from "@/actions/admin/carrier";
import { adminCarrierConditionsGetAllByCarrierId } from "@/actions/admin/carrier-condition";

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
