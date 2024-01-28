import { Lead } from "@prisma/client";

export function capitalize(text:string) {
    return text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export const replacePresetUser = (message: string, userName: string):string => {
    if (!userName) return message;
    // USER INFO
    message = message.replace("#my_first_name", userName);
    message = message.replace("#my_company_name", "Family First Life");
    return message;
  };
export const replacePreset = (message: string, userName: string, lead: Lead):string => {
    if (!userName || !lead) return message;
    // USER INFO
    message = message.replace("#my_first_name", userName);
    message = message.replace("#my_company_name", "Family First Life");
    // LEAD INFO
    message = message.replace("#first_name", lead.firstName);
    message = message.replace("#state", lead.state);
    return message;
  };
  
  