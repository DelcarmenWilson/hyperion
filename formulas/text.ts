import { Lead, User } from "@prisma/client";

export const capitalize = (text: string): string => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const replacePresetUser = (message: string, user: User): string => {
  if (!user) return message;
  // USER INFO
  message = message.replace("#my_first_name", user.firstName);
  message = message.replace("#my_company_name", "Family First Life");
  return message;
};
export const replacePreset = (
  message: string,
  user: User,
  lead: Lead
): string => {
  if (!user || !lead) return message;
  // USER INFO
  message = message.replace("#my_first_name", user.firstName);
  message = message.replace("#my_company_name", "Family First Life");
  // LEAD INFO
  message = message.replace("#first_name", lead.firstName);
  message = message.replace("#state", lead.state);
  return message;
};

export const getFileExtension = (filename: string): string | undefined => {
  const ext = filename.split(".").pop();
  return ext;
};
