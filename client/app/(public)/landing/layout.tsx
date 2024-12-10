import ChatBot from "@/components/global/chat-bot/chat-bot";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <ChatBot />
    </div>
  );
}
