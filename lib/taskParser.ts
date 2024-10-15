import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { Task } from './types/types.js';
//
function calCompletion(subtasks: { status: string }[]) {
    const total = subtasks.length;
    const completed = subtasks.filter(s => s.status === 'complete').length;
    return total > 0 ? (completed / total) * 100 : 0;
}

const statusMap: { [key: string]: string } = {
    'x': 'complete',
    '/': 'in-progress',
    '-': 'pending'
};

function setSubTaskStatus(symbol: string): string {
    return statusMap[symbol.toLowerCase()] || 'pending';
}

export async function* parseTaskFromFile({ file, delimiter }: { file: string; delimiter?: string }) {
    const _delimiter = delimiter ?? '---';
    let processingTask = false;
    let fileHandle: fs.FileHandle | null = null;
     let currentTask: Task | null = null;
        let currentTaskHeader: string | null = null;
    try {
        fileHandle = await fs.open(file, 'r');
        const fileReadStream = fileHandle.createReadStream();
        const rl = readline.createInterface({
            input: fileReadStream,
            crlfDelay: Infinity
        });
        for await (const line of rl) {
            const trimmedLine = line.trim();
            if (trimmedLine === _delimiter) {
                if (processingTask && currentTask) {
                    currentTask.percentage = calCompletion(currentTask.subtasks);
                    yield currentTask;
                    currentTask = null; // Reset task after yielding
                }
                processingTask = !processingTask;
                continue;
            }
            if (processingTask) {
                //
                const taskMatch = RegExp(/^# Task: ([\w ]+)/).exec(line);
                const subtaskMatch = RegExp(/^\s*-\s*\[\s*([-x/])\]\s*(.*)$/).exec(line);
                if (taskMatch) {
                     // If we encounter a new task while the current one is being processed, yield the current task
                     if (currentTask) {
                        currentTask.percentage = calCompletion(currentTask.subtasks);
                        yield currentTask;
                    }
                    const taskHeader = taskMatch[1];

                    currentTask = {
                        name: taskHeader,
                        percentage: 0,
                        subtasks: []//array of subtask
                    };

                    currentTaskHeader = taskHeader;
                }
                if (subtaskMatch && currentTaskHeader) {
                    const subTaskSymbolStatus = subtaskMatch[1];
                    const subTaskName = subtaskMatch[2];
                    let subTask = {
                        name: subTaskName,
                        status: setSubTaskStatus(subTaskSymbolStatus)
                    }
                    currentTask?.subtasks.push(subTask);
                }
            }

        }
         // If there's any remaining task after the loop, yield it
        if(currentTask){
            currentTask.percentage = calCompletion(currentTask.subtasks);
            yield currentTask;
        } 
    } catch (error) {
        console.error("Error reading file:", error);
        throw new Error(`Failed to parse file: ${error}`);
    } finally {
        if (fileHandle) {
            await fileHandle.close();
        }
    }
}

