import React from "react";
import { Header } from "./components/header";
import { Body } from "./components/body";
import { Form } from "./components/form";
import { conversationGetById } from "@/data/conversation";
import EmptyState from "../components/empty-state";
import { ConversationList } from "../components/conversation-list";

const ConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const conversation = await conversationGetById(params.conversationId);
  if (!conversation) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col flex-1 h-full ">
      <Header data={conversation!} />
      <Body initialData={conversation!} />
      <Form />
    </div>
  );
};

export default ConversationPage;
