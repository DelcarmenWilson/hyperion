import { conversationsGetByUserId } from "@/data/conversation";
import { ConversationList } from "./components/conversation-list";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await conversationsGetByUserId();
  return (
    <div className="flex flex-1 overflow-hidden">
      <ConversationList initialData={conversations!} />
      <div className=" flex-1 w-full px-4 overflow-y-auto">{children}</div>
    </div>
  );
}
