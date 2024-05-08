import {  client } from "@/lib/twilio/config";
//DATA
export const callsGetTwilio = async () => {
  //THIS IS A TEST DONT FORGET TO REMOVE
  try {

  const results = (await client.calls.get("CA09892b72046e6d5c1cc7edda42b7a134").fetch()).toJSON()
  
   //const tr:{}=formatObject(results)
  //  var j: any = {};
  
  //  results.forEach(function (value, key) {
  //    key = key.replace('"', "");
  //    j[key] = value;
  //  });
    return results;
  } catch (error: any) {
    return 0;
  }
};