export enum TaskType{
    LAUNCH_BROWSER="LAUNCH_BROWSER",
    PAGE_TO_HTML="PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT="EXTRACT_TEXT_FROM_ELEMENT",
    TEST_LEAD_TASK="TEST_LEAD_TASK"
}
export enum TaskParamType{
    STRING="STRING",
    BROWSER_INSTANCE="BROWSER_INSTANCE",
    SELECT="SELECT"
}

export interface TaskParam{
    name:string;
    type:TaskParamType;
    helperText?:string
    required?:boolean
    hideHandle?:boolean
    [key:string]:any
}

type TaskListType={
    value:string;
    name:string;
    tasks:string[]
}

export const TaskLists:TaskListType[]=[
    {
        value:"extraction",
        name:"Data extraction",
        tasks:[TaskType.PAGE_TO_HTML, TaskType.EXTRACT_TEXT_FROM_ELEMENT,TaskType.TEST_LEAD_TASK]
    }
]