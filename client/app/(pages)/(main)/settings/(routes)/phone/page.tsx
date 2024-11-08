import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneSettingsForm } from "./components/form";
import { phoneSettingsGet } from "@/actions/settings/phone";

const PhoneSettingPage = async () => {
  const phoneSettings = await phoneSettingsGet();
  if (!phoneSettings) return null;
  return (
    <ScrollArea>
      <PhoneSettingsForm phoneSettings={phoneSettings} />
    </ScrollArea>
  );
};

export default PhoneSettingPage;
