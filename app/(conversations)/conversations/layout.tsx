import NavBar from "@/components/navbar";
import { ConversationList } from "./components/conversation-list";
import { conversationsGetByUserId } from "@/data/conversation";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const conversations = await conversationsGetByUserId();
  return (
    <div className="h-full flex flex-col">
      <NavBar />
      <div className="flex flex-1  space-y-8 lg:space-y-0 overflow-hidden">
        <aside className="w-[300px] border-r relative overflow-hidden">
          {/* {JSON.stringify(conversations)} */}
          <ConversationList initialData={conversations!} />
        </aside>

        <div className=" flex flex-col flex-1 w-full overflow-y-auto border-r">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
