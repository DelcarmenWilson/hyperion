import ChatBot from "@/components/global/chat-bot/chat-bot";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-white bg-[#00416A]">
      {children}
      <ChatBot />
    </div>
  );
}
