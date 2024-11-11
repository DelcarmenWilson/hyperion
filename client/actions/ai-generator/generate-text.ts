"use server";

import { chatFetch } from "../gpt";
import { parseJson } from "@/lib/helper/json-parser";
import { DefaultKeyWords } from "@/constants/texts";
import { AiGeneratorResponse } from "@/types/ai-generator";

export const generateText = async ({
  prompt,
  keyword,
  quantity,
}: {
  prompt: string;
  keyword: boolean;
  quantity: number;
}) => {
//   const options = `Please generate ${quantity} choice${quantity > 1 && "s"}. Please generate each choice as a json object e.g.{message:string} `;
const options = `Please generate ${quantity} choice${quantity > 1 && "s"}. Reply with only the answer in JSON form and include no other commentary. return a stringyfied array format:choices[{message:string}].Provide your answer in JSON form.`;
  const keywords = keyword
    ? `Please use the following keywords${JSON.stringify(DefaultKeyWords)}`
    : "";
  const newMessage = {
    content: prompt + keywords + options,
    role: "system",
  };

  const responses = await chatFetch([newMessage]);
  const parsedResponse=parseJson(responses.choices[0].message.content as string) as AiGeneratorResponse[]
  return parsedResponse;
};
