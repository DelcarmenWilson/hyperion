import { currentUser } from "@/lib/auth";
import { MyPhoneNumbers } from "./components/my-phone-numbers";
import { PurchasePhoneNumberForm } from "./components/purchase-phone-numbers";
import { phoneNumbersGetByAgentId } from "@/data/phonenumber";

const PhonePage = async () => {
  const user = await currentUser();
  const phoneNumbers = await phoneNumbersGetByAgentId(user?.id as string);
  return (
    <div className="flex flex-col gap-3">
      <PurchasePhoneNumberForm />
      <MyPhoneNumbers phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
