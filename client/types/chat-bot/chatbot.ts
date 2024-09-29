import {  ChatbotMessage, ChatbotConversation } from "@prisma/client";


//CHATBOT
export type ShortChatbotConversation = ChatbotConversation & {
  lastMessage: ChatbotMessage |null;
};

export type FullChatbotConversation = ChatbotConversation & {
  messages: ChatbotMessage[];
};


