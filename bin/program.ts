import process from 'node:process';
import { join } from 'node:path';
import { Watcher } from '../lib/Watcher.js';
import { TaskPrinter } from '../lib/TaskPrinter.js';


const watcherFile = join(process.cwd(),'.tasks.md');


const watcher = new Watcher(watcherFile);
const taskPrinter = new TaskPrinter();
watcher.watch();

watcher.on('print', (args) => { 
    taskPrinter.print(args[1]);
});



