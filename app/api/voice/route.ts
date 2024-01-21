
import { tokenGenerator } from "@/lib/twilio-handler";
import { NextResponse } from "next/server";

export async function GET(req:Request){    
    try { 
          const token=tokenGenerator()
        return NextResponse.json(token)
    } catch (error) {
        console.log("VOICE_GET",error)
        return new NextResponse("Internal Error",{status:500})
    }
}