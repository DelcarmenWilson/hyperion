import {
  phoneNumbersGetAssigned,
  phoneNumbersGetUnassigned,
} from "@/data/phonenumbers";
import { AgentNumbersClient } from "./components/agentnumbers/client";
import { PurchaseNumbers } from "./components/purchasenumbers/client";
import { UnassignedNumbersClient } from "./components/unassigednumbers/client";

const PhonePage = async () => {
  const phoneNumbers = await phoneNumbersGetAssigned();
  const unasignedNumbers = await phoneNumbersGetUnassigned();
  return (
    <div className="flex flex-col gap-2 mt-2">
      <PurchaseNumbers />
      <UnassignedNumbersClient phoneNumbers={unasignedNumbers} />
      <AgentNumbersClient phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
