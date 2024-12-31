import { Command } from "commander";
import { checkFile,printProgramFooter,printProgramHeader,setStatusColor } from "./command-utils.js";
import { parseTaskFromFile } from "../taskParser.js";
import cliColor from 'cli-color';
import { handleError } from "./command-utils.js";

interface CheckCommandOptions {
    detailed:boolean,
    summary:boolean
};

export const checkCommand = new Command('check')
.description('Prints the total completion percentage of tasks and subtasks, along with detailed progress.')
.argument('[file]', 'The file to watch')
.option('-d, --detailed','Show all tasks and subtasks with their completion status.',false)
.action(async (file:string,options:CheckCommandOptions) => {
    if(!file) handleError(new Error('You must provide a valid filepath'));
    await checkFile(file);
    const { detailed } = options;
    let totalCompletion = 0;
    let taskCount = 0;
    const tasksIterator = parseTaskFromFile({file});
    printProgramHeader();
    for await (const task of tasksIterator) {
        const { percentage,name,subtasks } = task
        const formattedTask = cliColor.green(name);
        const taskCompletion = cliColor.yellow(percentage + '%');
        taskCount++;
        totalCompletion+= percentage;
        console.log(`# ${formattedTask} ==> ${taskCompletion}`);
        if(detailed) {
           subtasks.forEach(sub => {
                console.log(`\t> ${sub.name} [${setStatusColor(sub.status)}]`);
           }); 
        }
    }
    if(taskCount > 0) {
        console.log(`${cliColor.magenta('## Total Project completion')} ==> ${cliColor.yellow((totalCompletion / taskCount).toFixed(1) + '%' )}`);
    }
    printProgramFooter();
})