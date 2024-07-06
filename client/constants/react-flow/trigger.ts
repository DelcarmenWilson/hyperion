import {
  Bell,
  Cake,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  File,
  Files,
  LucideIcon,
  Tag,
  Unlink2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

// export type TriggerType = {
//   name: string;
//   type: string;
// };

export type TriggerType = {
  name: string;
  Icon: LucideIcon;
};

export const TRIGGER_ICONS_SELECT:TriggerType[] = [
  {
    name:"bell",
    Icon: Bell,
  }, {
    name:"cake",
    Icon: Cake,
  }, {
    name:"calendar",
    Icon: Calendar,
  }, {
    name:"checkSquare",
    Icon: CheckSquare,
  }, {
    name:"clipboardcheck",
    Icon: ClipboardCheck,
  }, {
    name:"file",
    Icon: File,
  },{
    name:"files",
    Icon: Files,
  },{
    name:"tag",
    Icon: Tag,
  },{
    name:"userplus",
    Icon: UserPlus,
  },
  {
    name:"users",
    Icon: Users,
  },{
    name:"xcircle",
    Icon: XCircle,
  },
];

export const TRIGGER_ICONS:{ [icon: string]: LucideIcon } = {
  cake: Cake,
};

export const getTriggerIcon=(name:string):LucideIcon=>{
  const icon =TRIGGER_ICONS_SELECT.find(e=>e.name==name)?.Icon
  if(!icon)
    return Unlink2
  return icon

}




// export const ALLTRIGGERS: TriggerType[] = [
//   //CONTACT
//   {
//     icon: Cake,
//     title: "Birthday Reminder",
//     type: "contact",
//   },
//   {
//     icon: Users,
//     title: "Contact Changed",
//     type: "contact",
//   },
//   {
//     icon: UserPlus,
//     title: "Contact Created",
//     type: "contact",
//   },
//   {
//     icon: XCircle,
//     title: "Contact DND",
//     type: "contact",
//   },
//   {
//     icon: Tag,
//     title: "Contact Tag",
//     type: "contact",
//   },
//   {
//     icon: Calendar,
//     title: "Custom Date Reminder",
//     type: "contact",
//   },
//   {
//     icon: File,
//     title: "Note Added",
//     type: "contact",
//   },
//   {
//     icon: Files,
//     title: "Note Changes",
//     type: "contact",
//   },
//   {
//     icon: ClipboardCheck,
//     title: "Task Added",
//     type: "contact",
//   },
//   {
//     icon: Bell,
//     title: "Task Reminder",
//     type: "contact",
//   },
//   {
//     icon: CheckSquare,
//     title: "Task Completed",
//     type: "contact",
//   },
// ];
