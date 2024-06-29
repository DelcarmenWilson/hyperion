import { Ban, PhoneIncoming, PhoneMissed, X } from "lucide-react";
export function getPhoneStatusText(status: string) {
  switch (status) {
    case "busy":
      return (
        <>
          <Ban size={16} /> Declined
        </>
      );
    case "no-answer":
      return (
        <div className=" text-red-600 flex gap-2">
          <PhoneMissed size={16} /> Missed
        </div>
      );
    case "failed":
      return (
        <>
          <X size={16} /> Failed
        </>
      );
    default:
      return (
        <>
          <PhoneIncoming size={16} /> Inbound
        </>
      );
  }
}

export const generateTextCode = (
  firstName: string,
  lastName: string,
  phoneNumber: string,
  alt: boolean = false
): string => {
  3478039626;
  const fInitial = firstName.substring(0, 1).toLowerCase();
  const lInitial = lastName.substring(0, 1).toLowerCase();

  // const pFour = phoneNumber.substring(alt ? 0 : phoneNumber.length - 4, 4);
  let pFour = "";
  pFour = alt
    ? phoneNumber.substring(phoneNumber.length - 10, 4)
    : phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length);

  console.log(phoneNumber.length, pFour);
  const code = `${fInitial}${lInitial}${pFour}`;

  return code;
};
