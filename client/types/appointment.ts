import {
    Lead,
    Appointment,
  } from "@prisma/client";
  
  export type CalendarAppointment = Appointment & {
    lead: {firstName:string} | null;    
    label: {color:string} | null;    
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
  