"use server"
import OpenAI from "openai";

export const chatFetch = async (messages: any=[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response;
};
