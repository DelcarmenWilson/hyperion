import { createContext, useContext } from "react";
import dayjs from "dayjs";
import { Appointment, AppointmentLabel, Schedule } from "@prisma/client";


interface IAppointmentContextState{
  schedule: Schedule | null;
  setSchedule: (e: Schedule) => void;
  appointments: Appointment[] | null;
  setAppointments: (e: Appointment[]) => void;
  userLabels:AppointmentLabel[] | null;
  setUserLabels: (e: AppointmentLabel[]) => void;
  monthIndex: number;
  setMonthIndex: (index: number) => void;
  smallCalendarMonth: number;
  setSmallCalendarMonth: (index: number) => void;
  daySelected: dayjs.Dayjs | undefined;
  setDaySelected: (day: dayjs.Dayjs) => void;
  showAppointmentModal: boolean;
  setShowAppointmentModal: (show: boolean) => void;
  dispatchCalAppointment: ({ type, payload }: { type: TAppointmentContextActions; payload: TAppointmentContextPayload }) => void;
  savedAppointments: {};
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  showLabelModal: boolean;  
  setShowLabelModal: (show: boolean) => void;
  selectedLabel: AppointmentLabel | null;
  setSelectedLabel: (appointment: AppointmentLabel | null) => void;
  updateLabel: (label: AppointmentLabel) => void;
  filteredAppointments: Appointment[];
}

export const defaultAppointmentContextState: IAppointmentContextState = {
  schedule: null,
  setSchedule: () => {},
  appointments: [],
  setAppointments: () => {},
  userLabels:[],
  setUserLabels: () => {},
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: undefined,
  setDaySelected: () => {},
  showAppointmentModal: false,
  setShowAppointmentModal: () => {},
  dispatchCalAppointment: () => {},
  savedAppointments: {},
  selectedAppointment: null,
  setSelectedAppointment: () => {},
  showLabelModal: false,
  setShowLabelModal: () => {},
  selectedLabel: null,
  setSelectedLabel: () => {},
  updateLabel: () => {},
  filteredAppointments: [],
};

export type TAppointmentContextActions = 'insert_appointment' |'update_appointment' | 'delete_appointment'|'insert_label' |'update_label' | 'delete_label' ;
export type TAppointmentContextPayload = string | Appointment[] | Appointment| AppointmentLabel[] | AppointmentLabel;

export interface IAppointmentContextActions {
    type: TAppointmentContextActions;
    payload: TAppointmentContextPayload;
}

export const AppointmentReducer = (state: IAppointmentContextState, action: IAppointmentContextActions) => {
    console.log('Message recieved - Action: ' + action.type + ' - Payload: ', action.payload);

    switch (action.type) {
      case 'update_appointment':
        return state
        // case 'update_appointment':
        //     return { ...state, appointment: action.payload as Appointment };
        // case 'update_uid':
        //     return { ...state, uid: action.payload as string };
        // case 'update_users':
        //     return { ...state, users: action.payload as UserAppointment[] };
        // case 'remove_user':
        //     return { ...state, users: state.users.filter(e => e.id !== (action.payload as string)) };
        
        default:
            return state;
    }
};


const AppointmentContext = createContext<IAppointmentContextState>({
  ...defaultAppointmentContextState
});

export const AppointmentContextConsumer = AppointmentContext.Consumer;
export const AppointmentContextProvider = AppointmentContext.Provider;

export default AppointmentContext;

export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "use Appointment Context must be used withing Appointment Context Provider"
    );
  }
  return context;
};
