import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import { currentRole } from "@/lib/auth";

export async function POST(req: Request) {
  const role=await currentRole()
  if(!role || role=="USER"){
    return NextResponse.json("Un authorized", { status: 401 });
  }
  const body = await req.json();
  const { option, state, areaCode } = body;

  const params:any={    
    limit: 20,
    voiceEnabled: true,
    mmsEnabled: true,
    smsEnabled: true,
  }

  if(option=="state"){
    params.inRegion=state
  }else{    
    params.areaCode=areaCode
  }

  const results = await client
    .availablePhoneNumbers("US")
    .local.list(params);

  return NextResponse.json(results, { status: 200 });
}
