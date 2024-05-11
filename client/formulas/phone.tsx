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
