import React from "react";
import { Header } from "./components/header";
import { Body } from "./components/body";
import { Form } from "./components/form";
import { conversationGetById } from "@/data/conversation";
import EmptyState from "../components/empty-state";
import { LeadColumn } from "../../leads/components/columns";
import { FullMessageType } from "@/types";

const ConversationPage = async ({
  params,
}: {
  params: { conversationId: string };
}) => {
  const conversation = await conversationGetById(params.conversationId);

  const lead = conversation?.lead;

  const formattedlead: LeadColumn = {
    id: lead?.id!,
    firstName: lead?.firstName!,
    lastName: lead?.lastName!,
    email: lead?.email!,
    cellPhone: lead?.cellPhone!,
    notes: lead?.notes!,
    createdAt: lead?.createdAt!,
  };

  if (!conversation) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col flex-1 h-full ">
      <Header lead={formattedlead} />
      {/*TODO see why the type is giving me an error */}
      {/* <Body
        initialMessages={conversation.messages!}
        leadLastName={lead?.lastName!}
      /> */}
      <Form />
    </div>
  );
};

export default ConversationPage;
