import { NextResponse } from "next/server";

import { cfg, client } from "@/lib/twilio-config";
import axios from "axios";

import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const body = await req.json();
  const { from,to } = body;
let results:any=[]
  await client.calls.list({ limit:20, }).then((recordings) =>
    recordings.forEach((r) => {
      console.log(r)
      if(r.price==null)
      return
      results.push({price:r.price})
      console.log(r.price)
    //   axios
    //     .get(
    //       `https://api.twilio.com/2010-04-01/Accounts/ACcbb7afdca3237e032cce13189ce0c2cf/Recordings/${r.sid}.mp3`
    //     )
    //     .then((data) => {
    //       console.log(data);
    //     });
    
  })  );
   //const results = (await client.recordings.get(recordId).fetch()).price;
 


  return NextResponse.json(results, { status: 200 });
}
