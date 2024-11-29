import { Lead, Appointment } from "@prisma/client";

export type CalendarAppointment = Appointment & {
  lead: { firstName: string } | null;
  label: { color: string } | null;
};

export type FullAppointment = Appointment & {
  lead: Lead;
};

//APOINTMENT CONTEXT
export type CalendarEvent = {
  id: string;
  label: string;
  [key: string]: any;
};
export type CalendarLabel = {
  label: string;
  checked: boolean;
};

export enum LabelColor {
  INDIGO = "INDIGO",
  GRAY = "GRAY",
  GREEN = "GREEN",
  BLUE = "BLUE",
  RED = "RED",
  PURPLE = "PURPLE",
  PRIMARY = "PRIMARY",
}

export const checkBoxColors = {
  [LabelColor.INDIGO]: "data-[state=checked]:bg-indigo-500 border-indigo-500",
  [LabelColor.GRAY]: "data-[state=checked]:bg-gray-500 border-gray",
  [LabelColor.GREEN]: "data-[state=checked]:bg-green-500 border-green",
  [LabelColor.BLUE]: "data-[state=checked]:bg-blue-500 border-blue-500",
  [LabelColor.RED]: "data-[state=checked]:bg-red-500 border-red-500",
  [LabelColor.PURPLE]: "data-[state=checked]:bg-purple-500 border-purple",
  [LabelColor.PRIMARY]: "",
};
export const labelColors = {
  [LabelColor.INDIGO]: "bg-indigo-200",
  [LabelColor.GRAY]: "bg-gray-200",
  [LabelColor.GREEN]: "bg-green-200",
  [LabelColor.BLUE]: "bg-blue-200",
  [LabelColor.RED]: "bg-red-200",
  [LabelColor.PURPLE]: "bg-purple-200",
  [LabelColor.PRIMARY]: "bg-primary text-background",
};

export const labelCirlceColors = {
  [LabelColor.INDIGO]: "bg-indigo-500",
  [LabelColor.GRAY]: "bg-gray-500",
  [LabelColor.GREEN]: "bg-green-500",
  [LabelColor.BLUE]: "bg-blue-500",
  [LabelColor.RED]: "bg-red-500",
  [LabelColor.PURPLE]: "bg-purple-500",
  [LabelColor.PRIMARY]: "bg-primary text-background",
};
