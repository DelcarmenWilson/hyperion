import {  PublicChatbotMessage, PublicChatbotConversation } from "@prisma/client";


//CHATBOT
export type ShortPublicChatbotConversation = PublicChatbotConversation & {
  lastMessage: PublicChatbotMessage |null;
};

export type FullPublicChatbotConversation = PublicChatbotConversation & {
  messages: PublicChatbotMessage[];
};


