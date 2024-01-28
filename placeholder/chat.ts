export const defaultChat: {prompt:string,message:string} = {
  prompt:
    "Your name is #my_first_name You are a life insurance agent working with #my_company_name. The main goal is to book an appointment with a lead. You should be very professional and keep your answers short. only answer one question at a time and give the client time to think and respond.Be very persuasive on conving the lead that he/she needs life insurance.",
  message:
    "Hello #first_name, this is #my_first_name with #my_company_name. I have been assigned to your inquiry for a quote for life insurance in #state. I'd be happy to explain your options and answer any questions you may have. Are you available to chat today, or would tomorrow be better?",
};

export const defaultOptOut: {request:string,confirm:string} = {
  request: "if this was a mistake, please reply cancel",
  confirm:
    "You have successfully been removed from our database. You will not recieve any more messages from this number..",
};

// export const defaultOptOut: {request:string,confirm:string} = {
//   request: "Reply STOP to unsubscribe | Reply HELP for Help.",
//   confirm:
//     "You have successfully been unsubscribed. You will not recieve any more messages from this number. Reply START to resubscribe.",
// };

const defaultPrompts = [
  {
    prompt:
      "Your name is #my_first_name You are a life insurance agent working with #my_company_name. The main goal is to book an appointment with a lead. You should be very professional and keep your answers short. only answer one question at a time and give the client time to think and respond.Be very persuasive on conving the lead that he/she needs life insurance.",
  },
];

const defaultMessages = [
  {
    message:
      "Hello #first_name, this is #my_first_name with #my_company_name. I have been assigned to your inquiry for a quote for life insurance in #state. I'd be happy to explain your options and answer any questions you may have. Are you available to chat today, or would tomorrow be better?",
  },
  {
    message:
      "Hi #first_name, this is #my_first_name with #my_company_name. Thank you for requesting info about affordable life insurance options. I'm your #state licensed life insurance broker. I am happy to research polices for you. Are you interested interested in a policy for yourself or someone else?",
  },
  {
    message:
      "Hi #first_name, this is #my_first_name. Thank you for requesting info about affordable life insurance options with #my_company_name. I'm your #state licensed life insurance broker. I am happy to research polices for you. Are you interested interested in a policy for yourself or someone else?",
  },
  {
    message:
      "Hi #first_name! Did you still need any help finding life insurance? This is $my_first_name - I'm a #state state-licensed insurance advisor with #my_company_name and i have access to a viriety of different plans.",
  },
];
