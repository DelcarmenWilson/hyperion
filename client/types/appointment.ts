import {
    Lead,
    Appointment,
  } from "@prisma/client";
  
  export type FullAppointment = Appointment & {
    lead: Lead;
    zone?:string;
    time?: string
    
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
  