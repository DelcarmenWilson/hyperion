import {  GptMessage, GptConversation } from "@prisma/client";


//CHATBOT
export type ShortGptConversation = GptConversation & {
  lastMessage: GptMessage |null;
};

export type FullGptConversation = GptConversation & {
  messages: GptMessage[];
};


