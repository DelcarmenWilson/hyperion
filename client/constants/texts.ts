import { MonthProps } from "@/types";

export type StatusType = {
  type: "lead" | "agent" | "general";
  name: string;
  value: string;
};

export const presetKeywords: string =
  "#first_name, #last_name, #full_name, #street_adress, #city, #state, #zip_code, #birthday,#my_first_name, #my_last_name, #my_full_name, #my_company_name, #my_booking_link";

export enum Keywords {
  FIRST_NAME = "#first_name",
  LAST_NAME = "#last_name",
  FULL_NAME = "#full_name",
  STREET_ADRESS = "#street_adress",
  CITY = "#city",
  STATE = "#state",
  ZIP_CODE = "#zip_code",
  BIRTHDAY = "#birthday",
  LEAD_ID = "#lead_id",
  SMOKER = "#smoker",
  
  MY_EMAIL = "#my_email",
  MY_OFFICE_PHONE_NUMBER = "#my_office_phone_number",
  MY_FORWARDING_NUMBER = "#my_forwarding_number",
  MY_FIRST_NAME = "#my_first_name",
  MY_LAST_NAME = "#my_last_name",
  MY_LICENSE = "#my_license",
  MY_FULL_NAME = "#my_full_name",
  MY_COMPANY_NAME = "#my_company_name",
  MY_BOOKING_LINK = "#my_booking_link",
  NEXT_MONTH_FULL_NAME = "#next_month_full_name",
  NEW_LINE = "#new_line",
}

export const DefaultKeyWords: StatusType[] = [
  { type: "lead", name: "first name", value: Keywords.FIRST_NAME },
  { type: "lead", name: "last name", value: Keywords.LAST_NAME },
  { type: "lead", name: "full name", value:Keywords.FULL_NAME},
  { type: "lead", name: "street adress", value: Keywords.STREET_ADRESS},
  { type: "lead", name: "city", value: Keywords.CITY },
  { type: "lead", name: "state", value: Keywords.STATE },
  { type: "lead", name: "zip_code", value: Keywords.ZIP_CODE },
  { type: "lead", name: "birthday", value: Keywords.BIRTHDAY },
  { type: "lead", name: "lead id", value: Keywords.LEAD_ID },
  { type: "agent", name: "my email", value: Keywords.MY_EMAIL },
  {
    type: "agent",
    name: "my office phone number",
    value: Keywords.MY_OFFICE_PHONE_NUMBER,
  },
  {
    type: "agent",
    name: "my forwarding number",
    value: Keywords.MY_FORWARDING_NUMBER,
  },
  { type: "agent", name: "my first name", value: Keywords.MY_FIRST_NAME },
  { type: "agent", name: "my last name", value: Keywords.MY_LAST_NAME },
  { type: "agent", name: "my full name", value: Keywords.MY_FULL_NAME },
  { type: "agent", name: "my company name", value: Keywords.MY_COMPANY_NAME },
  { type: "agent", name: "my booking link", value: Keywords.MY_BOOKING_LINK },
  {
    type: "general",
    name: "next month full name",
    value: Keywords.NEXT_MONTH_FULL_NAME,
  },
  { type: "general", name: "new line", value: Keywords.NEW_LINE},
];

export const DefaultStatus: StatusType[] = [
  { type: "lead", name: "New", value: "New" },
  { type: "lead", name: "Pending", value: "Pending" },
  { type: "lead", name: "In Progress", value: "In Progress" },
  { type: "lead", name: "Done", value: "Done" },
  { type: "lead", name: "Resolved", value: "Resolved" },
];

export const appointmentStatus = [
  "Closed",
  "No-Show",
  "Scheduled",
  "Rescheduled",
];

export const allMonths: MonthProps[] = [
  { name: "January", abv: "Jan", value: 0 },
  { name: "February", abv: "Feb", value: 1 },
  { name: "March", abv: "Mar", value: 2 },
  { name: "April", abv: "Apr", value: 3 },
  { name: "May", abv: "May", value: 4 },
  { name: "June", abv: "Jun", value: 5 },
  { name: "July", abv: "Jul", value: 6 },
  { name: "August", abv: "Aug", value: 7 },
  { name: "September", abv: "Sep", value: 8 },
  { name: "October", abv: "Oct", value: 9 },
  { name: "November", abv: "Nov", value: 10 },
  { name: "December", abv: "Dec", value: 11 },
];
