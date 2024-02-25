import { phoneNumbersGetAll } from "@/data/phonenumbers";
import { AgentNumbers } from "./components/agent-numbers";
import { PurchasePhoneNumbers } from "./components/purchase-phone-numbers";

const PhonePage = async () => {
  const phoneNumbers = await phoneNumbersGetAll();
  return (
    <div className="flex flex-col gap-2 mt-2">
      <PurchasePhoneNumbers />
      <AgentNumbers phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
