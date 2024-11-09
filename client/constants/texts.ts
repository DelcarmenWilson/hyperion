import { MonthProps } from "@/types";

export type StatusType = {
  type: "lead" | "agent" | "general";
  name: string;
  value: string;
};

export const presetKeywords: string =
  "#first_name, #last_name, #full_name, #street_adress, #city, #state, #zip_code, #birthday,#my_first_name, #my_last_name, #my_full_name, #my_company_name, #my_booking_link";

export const DefaultKeyWords: StatusType[] = [
  { type: "lead", name: "first name", value: "#first_name" },
  { type: "lead", name: "last name", value: "#last_name" },
  { type: "lead", name: "full name", value: "#full_name" },
  { type: "lead", name: "street adress", value: "#street_adress" },
  { type: "lead", name: "city", value: "#city" },
  { type: "lead", name: "state", value: "#state" },
  { type: "lead", name: "zip_code", value: "#zip_code" },
  { type: "lead", name: "birthday", value: "#birthday" },
  { type: "lead", name: "lead id", value: "#lead_id" },
  { type: "agent", name: "my email", value: " #my_email" },
  {
    type: "agent",
    name: "my office phone number",
    value: " #my_office_phone_number",
  },
  {
    type: "agent",
    name: "my forwarding number",
    value: " #my_forwarding_number",
  },
  { type: "agent", name: "my first name", value: " #my_first_name" },
  { type: "agent", name: "my last name", value: " #my_last_name" },
  { type: "agent", name: "my full name", value: " #my_full_name" },
  { type: "agent", name: "my company name", value: " #my_company_name" },
  { type: "agent", name: "my booking link", value: " #my_booking_link" },
  {
    type: "general",
    name: "next month full name",
    value: " #next_month_full_name",
  },
  { type: "general", name: "new line", value: " #new_line" },
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
