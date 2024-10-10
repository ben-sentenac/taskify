import { SnapShot } from "./types/types.js";
import { MultiBar, Presets } from 'cli-progress';
import cliColor from 'cli-color';
export default class Printer {
    snapShot: SnapShot;
    multibar: MultiBar
    stream;
    constructor(snapShot: SnapShot) {

        this.snapShot = snapShot;
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
        if(status === 'done') {
            return cliColor.green(status);
        } 
        if(status === 'in progress') {
            return cliColor.yellow(status);
        }

        if(status === 'not yet') {
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


    async print() {
        console.log('-'.repeat(150));
        console.log(new Date().toLocaleString());
        console.log('output:');
        console.log('-'.repeat(150));
        Object.keys(this.snapShot).forEach(task => {
             const bar = this.multibar.create(100, 0);
            bar.update(this.snapShot[task].percentage, { section: cliColor.blue(task)});
             this.multibar.stop();
            for(const subtask of this.snapShot[task].subtasks) {
                let status = this.setStatusColor(subtask.status);
                console.log(`${cliColor.blue('-')} ${subtask.name} - ${status}`);
            }
           console.log('-'.repeat(150));
        });
    }
}
