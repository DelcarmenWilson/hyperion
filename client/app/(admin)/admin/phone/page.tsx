import { AgentNumbersClient } from "./components/agentnumbers/client";
import { PurchaseNumbers } from "./components/purchasenumbers/client";
import { UnassignedNumbersClient } from "./components/unassigednumbers/client";
import {
  phoneNumbersGetAssigned,
  phoneNumbersGetUnassigned,
} from "@/data/phonenumber";
import { AssignNumberForm } from "./components/unassigednumbers/form";

const PhonePage = async () => {
  const phoneNumbers = await phoneNumbersGetAssigned();
  const unasignedNumbers = await phoneNumbersGetUnassigned();
  return (
    <div className="flex flex-col gap-2 mt-2 overflow-y-auto">
      <AssignNumberForm />
      <PurchaseNumbers />
      <UnassignedNumbersClient phoneNumbers={unasignedNumbers} />
      <AgentNumbersClient phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
