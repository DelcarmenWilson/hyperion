import { PhoneSettingsClient } from "./components/client";
import { phoneSettingsGet } from "@/actions/settings/phone";

const PhoneSettingPage = async () => {
  const phoneSettings = await phoneSettingsGet();
  if (!phoneSettings) return null;
  return <PhoneSettingsClient phoneSettings={phoneSettings} />;
};

export default PhoneSettingPage;
