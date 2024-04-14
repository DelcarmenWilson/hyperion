export type StatusType = {
  name: string;
  value: string;
};

export const presetKeywords: string =
  "#first_name, #last_name, #full_name, #street_adress, #city, #state, #zip_code, #birthday, #my_email, #my_office_phone_number, #my_forwarding_number, #my_first_name, #my_last_name, #my_full_name, #my_company_name, #my_booking_link, #next_month_full_name, #new_line";

export const DefaultStatus: StatusType[] = [
  { name: "New", value: "New" },
  { name: "Pending", value: "Pending" },
  { name: "In Progress", value: "In Progress" },
  { name: "Done", value: "Done" },
  { name: "Resolved", value: "Resolved" },
];
