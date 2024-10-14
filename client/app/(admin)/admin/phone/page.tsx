import { PageScrollArea } from "@/components/custom/layout/page-scroll-area";

import { AgentNumbersClient } from "./components/agentnumbers/client";
import { AssignNumberForm } from "./components/unassigednumbers/form";
import { PurchaseNumbers } from "./components/purchasenumbers/client";
import { UnassignedNumbersClient } from "./components/unassigednumbers/client";

const PhoneSetupPage = () => {
  return (
    <PageScrollArea>
      <AssignNumberForm />
      <PurchaseNumbers />
      <UnassignedNumbersClient />
      <AgentNumbersClient />
    </PageScrollArea>
  );
};

export default PhoneSetupPage;
