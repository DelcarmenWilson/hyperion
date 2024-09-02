import { account } from "@/lib/facebook/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let fields: any, params: any;
    fields = [
  
        "id",
        "name",
      
     
    ];
    params = {
      limit: 20,
    };

    let images = await account.getAdImages(fields, params);   

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_ADS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
