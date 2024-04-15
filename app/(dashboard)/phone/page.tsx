import { currentUser } from "@/lib/auth";
import { phoneNumbersGetByAgentId } from "@/actions/phonenumber";
import { MyPhoneNumbers } from "./components/my-phone-numbers";
import { PurchasePhoneNumbers } from "./components/purchase-phone-numbers";

const PhonePage = async () => {
  const user = await currentUser();
  const phoneNumbers = await phoneNumbersGetByAgentId(user?.id as string);
  return (
    <div className="flex flex-col gap-3">
      <PurchasePhoneNumbers />
      <MyPhoneNumbers phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
