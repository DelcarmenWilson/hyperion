import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt, message } = body;

  if (!prompt) {
    return new NextResponse("Prompt is required", { status: 400 });
  }
  if (!message) {
    return new NextResponse("Message is required", { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: message
      },
    ],
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

//   console.log(process.env.OPENAI_API_KEY, prompt, message);

  return NextResponse.json(response);
}
