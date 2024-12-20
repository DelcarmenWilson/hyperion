import { currentUser } from "@/lib/auth";
import { MyPhoneNumbers } from "./components/my-phone-numbers";
import { PurchasePhoneNumberForm } from "./components/purchase-phone-numbers";
import { getPhoneNumbersForAgent } from "@/actions/user/phone-number";

const PhonePage = async () => {
  const user = await currentUser();
  const phoneNumbers = await getPhoneNumbersForAgent(user?.id as string);
  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <PurchasePhoneNumberForm />
      <MyPhoneNumbers phoneNumbers={phoneNumbers} />
    </div>
  );
};

export default PhonePage;
