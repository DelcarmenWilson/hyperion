import { NextResponse } from "next/server";

import { cfg, client } from "@/lib/twilio-config";
import axios from "axios";

import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const body = await req.json();
  const { recordId } = body;

  // client.recordings.list({ limit: 20 }).then((recordings) =>
  //   recordings.forEach((r) => {
  //     console.log(r.sid);
  //     axios
  //       .get(
  //         `https://api.twilio.com/2010-04-01/Accounts/ACcbb7afdca3237e032cce13189ce0c2cf/Recordings/${r.sid}.mp3`
  //       )
  //       .then((data) => {
  //         console.log(data);
  //       });
  //   })
  // );
  // const results = (await client.recordings.get(recordId).fetch()).;
  const response = await axios.get(
    `https://api.twilio.com/2010-04-01/Accounts/${cfg.accountSid}/Recordings/${recordId}.mp3`
  );

  const data = await response.data;

  if (data) {
    // const formData=new FormData()
    // formData.append("audiofile",data)
    const file: File | null = data.blob;

    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${recordId}.mp3`;
    await writeFile(
      path.join(process.cwd(), "public/recordings/" + filename),
      buffer
    );
  }
  return NextResponse.json(recordId, { status: 200 });
}
