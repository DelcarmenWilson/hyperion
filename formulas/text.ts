import { Lead, User } from "@prisma/client";

export const capitalize = (text: string): string => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const getIntials = (firstName: string,lastName:string): string => {
  
  return `${firstName.substring(0,1)}${lastName.substring(0,1)}`
 
};

export const replacePresetUser = (message: string, user: User): string => {
  if (!user) return message;
  // USER INFO
  message = message
    .replace("#my_first_name", user.firstName)
    .replace("#my_company_name", "Family First Life");
  return message;
};
export const replacePreset = (
  message: string,
  user: User,
  lead: Lead
): string => {
  if (!user || !lead) return message;
  // USER INFO
  message = message.replace("#my_first_name", user.firstName)
  .replace("#my_company_name", "Family First Life")
  // LEAD INFO
  .replace("#first_name", lead.firstName)
  .replace("#state", lead.state);
  return message;
};

export const getFileExtension = (filename: string): string | undefined => {
  const ext = filename.split(".").pop();
  return ext;
};
