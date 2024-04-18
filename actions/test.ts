"use server";
import { cfg, client } from "@/lib/twilio-config";

export const creatCall = async () => {
    const call = await client.calls.create({
    to: "+13478030962",
    from: "+18623527091",
    url:"https://insect-pro-luckily.ngrok-free.app/voice?agentId=clrwf7ad90003kcd3fylp7yq1&recording=record-from-answer-dual&coach=off&direction=outbound",
    // applicationSid: `${cfg.twimlAppSid}?agentId=clrwf7ad90003kcd3fylp7yq1&recording=record-from-answer-dual&coach=off&direction=outbound`,
    
  });
  //   .then((call) => {
  //     const twiml = new vResponse();

  //     twiml.dial(
  //       {
  //         callerId: call.from,
  //         record: "record-from-answer-dual",
  //         recordingStatusCallback: "/api/voice/recording",
  //       },
  //       call.to
  //     );
  //   });

  return call;
};


