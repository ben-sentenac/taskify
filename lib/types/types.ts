export interface SubTask {
    name:string,
    status:string
}

export interface Task  {
    name:string,
    percentage:number,
    subtasks:SubTask[]
}
export interface SnapShot  {
    [key:string]:Task
}