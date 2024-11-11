import { capitalize } from "@/formulas/text";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  //The paramters passed in from Resend
  const email:{data:{email_id:string},type:string} = await req.json();
  let status=email.type.replace("email.","")
  status=capitalize(status)

 await db.email.update({where:{id:email.data.email_id},data:{status}})
 //TODO - possiblity send the email status in real time
    // sendSocketData(conversation.agentId, "conversation-messages:new", [
    //   newMessage,
    //   newChatMessage,
    // ]);
  return new NextResponse("success", { status: 200 });
}
