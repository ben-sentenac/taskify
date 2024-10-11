import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { SnapShot,SubTask } from './types/types.js';
//
function calcProgress(subTaskArray:SubTask[]) {
    const numberOfCompleted = subTaskArray.filter(({status}) => status === 'DONE').length;
    return Number((( numberOfCompleted / subTaskArray.length ) * 100).toFixed(2));
}

function setSubTaskStatus(status:string) {
    switch(status) {
        case '-':
            return 'TODO';
        case '/':
            return 'IN_PROGRESS';
        case 'x':
            return 'DONE';
        default:
            return 'TODO';
    }
}
export async function parseFile(file: string):Promise<SnapShot> {
    let fileHandle: fs.FileHandle;
    const taskDict:SnapShot = {};
    let currentTask: string | null = null;
    let processingTask = false;//control the processing flow
    try {
        fileHandle = await fs.open(file, 'r');
        //TODO can replace all readline piping by new convenient method fileHanlde.readlines()
        const fileStream = fileHandle.createReadStream();
        const rl =  readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        for await (const line of rl) {
            const trimedLine = line.trim();
            //For now parse the content betwenn 2 delimiter --- --- ignore before and after
            if (trimedLine === '---') {
                processingTask = !processingTask;
                continue;
            }
            if (processingTask) {
                const taskMatch = line.match(/^# Task: ([\w ]+)/);
                const subtaskMatch = line.match(/^\s*-\s*\[\s*([-x/])\]\s*(.*)$/);
                if (taskMatch) {
                    const taskHeader = taskMatch[1];
                    taskDict[taskHeader] = {
                        percentage:0,
                        subtasks: []
                    }
                    //update currentTask
                    currentTask = taskHeader;
                }
                if (subtaskMatch && currentTask) {
                    const subtaskStatus = subtaskMatch[1];
                    const subtaskName = subtaskMatch[2];

                    const subtask:SubTask = {
                        name: subtaskName,
                        status: setSubTaskStatus(subtaskStatus)
                    }
                    taskDict[currentTask].subtasks.push(subtask);
                    //TODO 
                    //mabe calcprogress only if data has change ? 
                    taskDict[currentTask].percentage = calcProgress(taskDict[currentTask].subtasks)
                }
            }
        }
        return taskDict;
    } catch (error) {
        //TODO handling proper error
        throw error;
    }
}

