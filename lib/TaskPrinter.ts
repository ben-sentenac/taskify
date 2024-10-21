import { Task } from "./types/types.js";
import { MultiBar, Presets } from 'cli-progress';
import cliColor from 'cli-color';
export class TaskPrinter {
    multibar: MultiBar
    stream;
    constructor() {
        this.stream = process.stdout;
        this.multibar = new MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            stream: this.stream,
            format: '{section} | ' + cliColor.greenBright.bgWhiteBright('{bar}') + ' |  {value}  % completed\n',
        }, Presets.shades_classic);
    }



    setStatusColor(status:string) {
        status = status.trim().toLowerCase();
        if(status === 'complete') {
            return cliColor.green(status);
        } 
        if(status === 'in-progress') {
            return cliColor.yellow(status);
        }

        if(status === 'pending') {
            return cliColor.red(status);
        }
    }

    setValueColor(percentage:number) {
        if(percentage === 0) {
            return cliColor.red(percentage);
        }

        if(percentage === 100) {
            return cliColor.green(percentage)
        } else {
            return cliColor.yellow(percentage);
        }
    }


    async print(taskGenerator:AsyncIterable<Task>) {
        console.log('-'.repeat(100));
        console.log(new Date().toLocaleString());
        console.log('output:');
        console.log('-'.repeat(100));
        for await (const task of taskGenerator ) {
            const bar = this.multibar.create(100,0);
            bar.update(task.percentage,{ section: cliColor.blue(task.name)});
            for(const subtask of task.subtasks) {
                let status = this.setStatusColor(subtask.status);
                console.log(`${cliColor.blue('-')} ${subtask.name} - ${status}`);
            }
           console.log('-'.repeat(150));
        }
    }
}
