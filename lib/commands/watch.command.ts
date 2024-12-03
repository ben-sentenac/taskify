import { Command } from "commander";
import { Watcher } from "../Watcher.js";
import cliColor from 'cli-color';
import process from "process";
import { join } from 'node:path';
import { SubTask, Task } from "../types/types.js";
import { checkFile, printProgramFooter, printProgramHeader, setStatusColor } from "./command-utils.js";
//import { fileExists } from "../utils.js";
/**
 * Continuously monitor the .tasks.md file
 * Description: Watches for changes in the .tasks.md file, parsing and displaying the updated status in real time.
* --silent: Only display task completion status without detailed output.  
 */
interface WatchCommandOptions {
    showCompletion:boolean,
    verbose:boolean,
    stopAfter:string
};


//TODO add silent options
//TODO refactor and add color output 
//TODO add GUI options:start a server and open UI Interface to manage task
//TODO mabe tracjk the printed line to refresh the terminal more clearly
export const watchCommand = new Command('watch')
    .description('Watch a .tasks.md file for changes')
    .argument('[file]', 'The .tasks.md file to watch',join(process.cwd(),'tasks.md'))
    .option('-s, --show-completion', 'Display overall project completion percentage', false)
    .option('-v, --verbose', 'Show detailed information on each change', false)
    .option('-a, --stop-after <num>', 'Stop watching after a certain number of changes', '0')
    .action(async (file:string, options:WatchCommandOptions) => {
        await checkFile(file);
        const {showCompletion, verbose, stopAfter } = options;
        const watcher = new Watcher(file);
        let changeCount = 0;   
        watcher.on('update', async (count:number, tasksIterator:AsyncIterable<Task>) => {
            changeCount++;
            // Clear the terminal to refresh the output
            console.clear();
            printProgramHeader();
            console.log(cliColor.magentaBright('--Watching mode--'));
            console.log(`\nFile Change detected: ${count}\n`);
            let totalCompletion = 0;
            let taskCount = 0;

            for await (const task of tasksIterator) {
                taskCount++;
                if (showCompletion) {
                    totalCompletion += task.percentage;
                }
                const formattedTask = cliColor.bgGreen(task.name);
                console.log(`# ${formattedTask} ==> ${cliColor.yellow(task.percentage.toFixed(1) + '%')}`);
                task.subtasks.forEach((sub:SubTask) => {
                    const statusMessage = `  > ${sub.name} [${setStatusColor(sub.status)}]`;
                    console.log(verbose ? `${statusMessage} - Detailed` : statusMessage);
                });
                console.log();
            }
            if (showCompletion && taskCount > 0) {
                const overallCompletion = (totalCompletion / taskCount).toFixed(1);
                console.log(`${cliColor.magenta('# Overall Project Completion')} ==> ${cliColor.yellow(overallCompletion + '%')}`);
            }
            // Stop watching if change limit is reached
            if (+stopAfter > 0 && changeCount >= +stopAfter) {
                console.log(`\nReached maximum of ${stopAfter} changes. Stopping watch file...`);
                await watcher.stopWatching();
            }
           printProgramFooter();
        }); 
        await watcher.watch();
    });