import { Command } from "commander";
import { Watcher } from "../Watcher.js";
import cliColor from 'cli-color';
import process from "process";
import { join } from 'node:path';
import { SubTask } from "../types/types.js";
/**
 * Continuously monitor the .tasks.md file
 * Description: Watches for changes in the .tasks.md file, parsing and displaying the updated status in real time.
 * --interval <seconds>: Adjust the watch interval for change detection (useful for throttling).
* --silent: Only display task completion status without detailed output.  
 */
export const watchCommand = new Command('watch')
    .description('Watch a .tasks.md file for changes')
    .argument('<file>', 'The .tasks.md file to watch')
    .option('-s, --show-completion', 'Display overall project completion percentage', false)
    .option('-v, --verbose', 'Show detailed information on each change', false)
    .option('-a, --stop-after <num>', 'Stop watching after a certain number of changes', '0')
    .action(async (file, options) => {
        const {showCompletion, verbose, stopAfter } = options;
        const watcher = new Watcher(file);
        let changeCount = 0;   
        watcher.on('update', async (count, tasksIterator) => {
            changeCount++;
            // Clear the terminal to refresh the output
            console.clear();
            console.log(`\nChange detected #${count}`);

            let totalCompletion = 0;
            let taskCount = 0;

            for await (const task of tasksIterator) {
                taskCount++;
                if (showCompletion) {
                    totalCompletion += task.percentage;
                }
                
                console.log(`- Task: ${task.name} (${task.percentage.toFixed(1)}% complete)`);
                task.subtasks.forEach((sub:SubTask) => {
                    const statusMessage = `  - Subtask: ${sub.name} [${sub.status}]`;
                    console.log(verbose ? `${statusMessage} - Detailed` : statusMessage);
                });
            }

            if (showCompletion && taskCount > 0) {
                const overallCompletion = (totalCompletion / taskCount).toFixed(1);
                console.log(`\nOverall Project Completion: ${overallCompletion}%`);
            }

            // Stop watching if change limit is reached
            if (stopAfter > 0 && changeCount >= stopAfter) {
                console.log(`\nReached maximum of ${stopAfter} changes. Stopping watcher...`);
                await watcher.stopWatching();
            }
        }); 
        await watcher.watch();
    });