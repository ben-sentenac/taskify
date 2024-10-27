//import cliProgress from 'cli-progress';
import cliColor from 'cli-color';
import { Task } from './types/types.js';
import process from 'node:process';
import { Direction } from 'node:readline';
import figlet from 'figlet';

export class TaskPrinter {
    private readonly multibar: any;
    private readonly stream: NodeJS.WriteStream;
    private writtenLines:number;

    constructor() {
        this.stream = process.stdout;
        this.writtenLines = 0;
        // Initialize the multibar for progress tracking
        /*
        this.multibar = new cliProgress.MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: '{bar} | {percentage}% | {section}',
        }, cliProgress.Presets.shades_classic);
        */
        console.log('-'.repeat(50));
       console.log(figlet.textSync('Taskify'));
       console.log('Version:1.0');
       console.log('Cli Task list manager');
       console.log('-'.repeat(50));
    }

    // Utility function to set status color
    private setStatusColor(status: string): string {
        switch (status) {
            case 'complete': return cliColor.green('complete');
            case 'in-progress': return cliColor.yellow('in-progress');
            case 'pending': return cliColor.red('pending');
            default: return status;
        }
    }

    // Utility function to compute total completed task percentage
    private totalCompletedTask(completedTasks: number[]): number {
        const total = completedTasks.reduce((sum, val) => sum + val, 0);
        return Math.round(total / completedTasks.length);
    }

    async print(taskGenerator: AsyncIterable<Task>) {
        await this.clearlines(this.writtenLines);
        const completedTasks: number[] = [];
        let output = '';
          // Map to store progress bars for each task
          
        const bars = new Map<string, any>();
      
       
        for await (const task of taskGenerator) {
                completedTasks.push(task.percentage);
                 // Create a progress bar for each task if it doesn't exist
            if (!bars.has(task.name)) {
                //const bar = this.multibar.create(100, 0); // Create a progress bar with range 0 to 100
                //bars.set(task.name, bar);
            }
               const bar = bars.get(task.name);
                //bar.update(task.percentage, { section: cliColor.blue(task.name) }); 
                this.writtenLines++;
                output += cliColor.bgGreen(cliColor.black('>' + task.name + ':')) + '\n';
               // this.multibar.stop();
                for (const sub of task.subtasks) {
                    let status = this.setStatusColor(sub.status);
                   output+= `${cliColor.blue('-')} ${sub.name} - ${status}\n`;
                } 
        }
        process.nextTick(() => {
            this.stream.write(output);
        });
        
        const total = this.totalCompletedTask(completedTasks);
        const message = !isNaN(total) ? `\nTotal Project Completion: ${this.totalCompletedTask(completedTasks)}%\n\n`: `No tasks to print`;
        this.stream.write(cliColor.magenta(message)); 
    }

    moveCursor(positionX: number, positionY: number) {
        return new Promise<void>((resolve,reject) => {
            this.stream.moveCursor(positionX, positionY);
            resolve();
        })
        
    }
    clearLine(dir: Direction) {
        return new Promise<void>((resolve, reject) => {
              this.stream.clearLine(dir);
              resolve();
        })
      
    }

    async clearlines(numberOfLine: number) {
        for (let i = 0; i <= numberOfLine; i++) {
            await this.moveCursor(0, -1);
            await this.clearLine(0); 
        }
        this.writtenLines = 0;
    }
}
