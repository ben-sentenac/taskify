import { Command } from "commander";
import { Watcher } from "../Watcher.js";


export const watchCommand = new Command('watch')
.description('Watch a .tasks.md file for changes')
.argument('<file>', 'The .tasks.md file to watch')
.action(async (file) => {
    //TODO
    try {
        const watcher = new Watcher(file);
        await watcher.watch();
    } catch (error) {
        throw error;
    }
});