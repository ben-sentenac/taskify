import cliColor from 'cli-color';
import { fileExists } from '../utils.js';
import process from 'node:process';

import constants from '../constants.js';

const { version,author,repo,pDescription,pName } = constants;
// Utility function to set status color

export function setStatusColor(status: string): string {
    switch (status) {
        case 'complete': return cliColor.green('complete');
        case 'in-progress': return cliColor.yellow('in-progress');
        case 'pending': return cliColor.red('pending');
        default: return status;
    }
}

export function totalCompletedTask(completedTasks: number[]): number {
    const total = completedTasks.reduce((sum, val) => sum + val, 0);
    return Math.round(total / completedTasks.length);
}
//TODO gracefull shutdown and proper handle error into a class ?
export async function checkFile(file:string) {
    if(! await fileExists(file)) {
        printProgramHeader();
        process.stderr.write(`${cliColor.red('ERROR')}: The file ${file} does not exist\n`);
        printProgramFooter();
        gracefullExit(1);
    }
}

export function gracefullExit(code:0 | 1 = 0,delay:number = 0,unref = false) {
    const timeout = setTimeout(() => {
        process.exit(code);
    },delay); 
    if(unref) {
        timeout.unref();
    }
}

export function printProgramHeader() {
    console.log('_'.repeat(50));
    console.log();
    console.log(cliColor.blue.underline(`${pName} V${version}`));
    console.log(`Author:${author}`);
    console.log(`Repository: ${repo}`);
    console.log(`Description: ${pDescription}`);
}

export function printProgramFooter() {
    console.log('_'.repeat(50));
    console.log();
}