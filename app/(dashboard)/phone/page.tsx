import { phoneNumbersGetByAgentId } from "@/data/phonenumbers";
import { MyPhoneNumbers } from "./components/my-phone-numbers";
import { PurchasePhoneNumbers } from "./components/purchase-phone-numbers";
import { currentUser } from "@/lib/auth";
import { PhoneNumberColumn } from "./components/columns";

const PhonePage = async () => {
  const user = await currentUser();
  const phoneNumbers = await phoneNumbersGetByAgentId(user?.id as string);

  const formmatedPhoneNumbers: PhoneNumberColumn[] = phoneNumbers.map((ph) => ({
    id: ph.id,
    phone: ph.phone,
    state: ph.state,
    reneAt: ph.renewAt,
    status: ph.status,
    updateAt: ph.updatedAt,
  }));
  return (
    <div className="flex flex-col gap-3">
      <PurchasePhoneNumbers />
      <MyPhoneNumbers phoneNumbers={formmatedPhoneNumbers} />
    </div>
  );
};

export default PhonePage;
