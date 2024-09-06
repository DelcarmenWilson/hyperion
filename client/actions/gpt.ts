"use server"
import OpenAI from "openai";

export const chatFetch = async (messages: any=[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization:"org-TTrcbaMEsZZ1KaQ5DaK9Cx4w",
    project:"proj_aDnytZJ3qEfGlMPs0S1WdaJJ",
  });
  
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: messages,
  //   temperature: 0,
  //   max_tokens: 1024,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,    
  // });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    
    messages: messages,
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,    
  });
  
 
  return response;
};


