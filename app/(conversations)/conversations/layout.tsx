import NavBar from "@/components/navbar";
import { Sidebar } from "./components/sidebar";
import { currentUser } from "@/lib/auth";
import { ConversationsGetByUserId } from "@/data/conversation";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const conversations = await ConversationsGetByUserId(user?.id as string);
  return (
    <div className="h-full flex flex-col">
      <NavBar />
      <div className="flex flex-1  space-y-8 lg:space-y-0">
        <aside className="-mx-4 w-[250px] border-r relative overflow-hidden">
          <Sidebar initialData={conversations} />
        </aside>

        <div className=" flex-1 w-full px-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ChatLayout;
