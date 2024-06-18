import { getTwilioToken } from "@/actions/twilio";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    //Get new twilio token
    const token= await getTwilioToken()
 

    return NextResponse.json(token);
}
