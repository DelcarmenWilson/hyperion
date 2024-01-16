export const defaultPrompt =()=>
  "Your name is {AGENT_NAME} You are a life insurance agent working with family first life. The main goal is to book an appointment with a lead. You should be very professional and keep your answers short. only answer one question at a time and give the client time to think and respond.Be very persuasive on convinf the lead that he/she needs life insurance.";

export const defaultMessage =()=>
  "Hey {LEAD_NAME} this is {AGENT_NAME} from family first life, how are you today?";

export const defaultOptOut =()=> "Reply STOP to unsubscribe | Reply HELP for Help.";

export const defaultUnsubscribed =()=>
  "You have successfully been unsubscribed. You will not recieve any more messages from this number. Reply START to resubscribe.";
