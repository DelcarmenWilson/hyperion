import * as z from "zod"
import { NextResponse } from "next/server";
import { MessageSchema } from "@/schemas";
import { messageInsert } from "@/actions/message";
import { chatFetch } from "@/actions/chat";

export async function POST(req:Request) {

  const body = await req.formData();
  var j:any = {};
  body.forEach(function (value, key) {
    key=key.replace("\"","")
    j[key] = value;
  });
  const sms:z.infer<typeof MessageSchema> = {
    toCountry: j.ToCountry,
    toState: j.ToState,
    smsMessageSid: j.SmsMessageSid,
    numMedia: j.NumMedia,
    toCity: j.ToCity,
    fromZip: j.FromZip,
    smsSid: j.SmsSid,
    fromState: j.FromState,
    smsStatus: j.SmsStatus,
    fromCity: j.FromCity,
    body: j.Body,
    fromCountry: j.FromCountry,
    to: j.To,
    messagingServiceSid: j.MessagingServiceSid,
    toZip: j.ToZip,
    numSegments: j.NumSegments,
    messageSid: j.MessageSid,
    accountSid: j.AccountSid,
    from: j.From,
    apiVersion: j.ApiVersion,
  };
  // "ToCountry":"US","ToState":"NJ","SmsMessageSid":"SMf9544104901777bdc625db7e83883372","NumMedia":"0","ToCity":"","FromZip":"10523","SmsSid":"SMf9544104901777bdc625db7e83883372","FromState":"NY","SmsStatus":"received","FromCity":"ELMSFORD","Body":"Testing 16","FromCountry":"US","To":"+18623527091","MessagingServiceSid":"MG5038e5049be407fbe4aae89ec857b512","ToZip":"","NumSegments":"1","MessageSid":"SMf9544104901777bdc625db7e83883372","AccountSid":"ACcbb7afdca3237e032cce13189ce0c2cf","From":"+13478030962","ApiVersion":"2010-04-01"
  var messages:any=[]
  messages.push({role: "user",
  content: sms.body})

  await messageInsert(sms)

  const prompt="You are very grumpy. Please answer my question with sacarsam and grumpiness."
  const chatresponse= await chatFetch(prompt,messages)

  if(!chatresponse)
  {
    return new NextResponse("Thank you for your message",{status:200})
  }  

  return new NextResponse(chatresponse.choices[0].message.content, { status: 200 });
}
