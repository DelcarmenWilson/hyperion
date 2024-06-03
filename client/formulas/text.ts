import { ShortUser } from "@/types";
import { Lead } from "@prisma/client";
import { format } from "date-fns";

export const capitalize = (text: string): string => {
  if (!text) return text;
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const getIntials = (firstName: string, lastName: string): string => {
  return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`;
};

export const replacePresetUser = (message: string, user: ShortUser): string => {
  if (!user) return message;
  // USER INFO
  message = message
    .replace("#my_first_name", user.firstName)
    .replace("#my_company_name", user.team?.name!);
  return message;
};
export const replacePreset = (
  message: string,
  user: ShortUser,
  lead: Lead
): string => {
  if (!user || !lead) return message;
  // USER INFO
  message = message
    .replace("#my_first_name", user.firstName)
    .replace("#my_last_name", user.lastName)
    .replace("#my_full_name", `${user.firstName} ${user.lastName}`)
    .replace("#my_company_name", user.team?.name!)
    .replace("#my_booking_link", `https://hperioncrm.com/book/${user.userName}`)

    // LEAD INFO
    .replace("#first_name", lead.firstName)
    .replace("#full_name", lead.lastName)
    .replace("#first_name", `${lead.firstName} ${lead.lastName}`)
    .replace("#street_adress", lead.address ? lead.address : "")
    .replace(
      "#birthday",
      lead.dateOfBirth ? format(lead.dateOfBirth, "MM-dd-yyyy") : ""
    )
    .replace("#city", lead.city ? lead.city : "")
    .replace("#state", lead.state)
    .replace("#zip_code", lead.zipCode ? lead.zipCode : "");

  (" #my_email,#my_office_phone_number, #my_forwarding_number,#next_month_full_name, #new_line");
  return message;
};

export const getFileExtension = (filename: string): string | undefined => {
  const ext = filename.split(".").pop();
  return ext;
};

type Data= {
  [key: string]: string;
}
export const stringToJson = (text: string): {Height:string,Weight:string,IsSmoker:string,DesiredCoverageAmount:string}|null => {
  if (!text) return null;
   const pairs = text.match(/\[([^\]]+)\]/g)?.map((pair) => pair.slice(1, -1));
  if(!pairs)return null
  
  const data: Data = {};
  pairs.forEach((pair) => {
    let [key, value] = pair.split(": ");
    key = key.replaceAll(" ", "");
    data[key] = value;
  });
//@ts-ignore
  return data;
};
