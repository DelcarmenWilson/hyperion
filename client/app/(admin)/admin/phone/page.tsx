import { AgentNumbersClient } from "./components/agentnumbers/client";
import { PurchaseNumbers } from "./components/purchasenumbers/client";
import { UnassignedNumbersClient } from "./components/unassigednumbers/client";
import {
  phoneNumbersGetAssigned,
  phoneNumbersGetUnassigned,
} from "@/actions/user/phone-number";
import { AssignNumberForm } from "./components/unassigednumbers/form";
import { PageScrollArea } from "@/components/custom/layout/page-scroll-area";

const PhonePage = async () => {
  const phoneNumbers = await phoneNumbersGetAssigned();
  const unasignedNumbers = await phoneNumbersGetUnassigned();
  return (
    <PageScrollArea>
      <AssignNumberForm />
      <PurchaseNumbers />
      <UnassignedNumbersClient phoneNumbers={unasignedNumbers} />
      <AgentNumbersClient phoneNumbers={phoneNumbers} />
    </PageScrollArea>
  );
};

export default PhonePage;
