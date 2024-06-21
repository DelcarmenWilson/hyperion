export type StatusType = {
  name: string;
  value: string;
};

export const presetKeywords: string =
"#first_name, #last_name, #full_name, #street_adress, #city, #state, #zip_code, #birthday,#my_first_name, #my_last_name, #my_full_name, #my_company_name, #my_booking_link";

export const DefaultKeyWords: StatusType[] = [
  { name: "first name", value: "#first_name" },
  { name: "last name", value: "#last_name" },
  { name: "full name", value: "#full_name" },
  { name: "street adress", value: "#street_adress" },
  { name: "city", value: "#city" },
  { name: "state", value: "#state" },
  { name: "zip_code", value: "#zip_code" },
  { name: "birthday", value: "#birthday" },
  { name: "lead id", value: "#lead_id" },
  { name: "my email", value: " #my_email" },
  { name: "my office phone number", value: " #my_office_phone_number" },
  { name: "my forwarding number", value: " #my_forwarding_number" },
  { name: "my first name", value: " #my_first_name" },
  { name: "my last name", value: " #my_last_name" },
  { name: "my full name", value: " #my_full_name" },
  { name: "my company_name", value: " #my_company_name" },
  { name: "my booking_link", value: " #my_booking_link" },
  { name: "next month full name", value: " #next_month_full_name" },
  { name: "new line", value: " #new_line" },
];

export const DefaultStatus: StatusType[] = [
  { name: "New", value: "New" },
  { name: "Pending", value: "Pending" },
  { name: "In Progress", value: "In Progress" },
  { name: "Done", value: "Done" },
  { name: "Resolved", value: "Resolved" },
];
