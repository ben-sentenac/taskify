import { EventEmitter } from "node:events";
import { SnapShot } from "./types/types.js";
import { deepEqual } from "./utils.js";
import { parseFile } from "./taskParser.js";
import fs from 'node:fs/promises';
import { basename } from "node:path";


//TODO consider checking if file exits and limit extention name 
export class Watcher extends EventEmitter {
    protected file: string;
    protected snapshot: SnapShot | null;
    public shoulUpdate: boolean;
    protected printCount: number;
    readonly ac: AbortController;
    readonly signal: AbortSignal;

    constructor(file: string) {
        super();

        this.file = file;
        this.snapshot = null;
        this.shoulUpdate = false;
        this.printCount = 0;
        this.ac = new AbortController();
        this.signal = this.ac.signal;
    }

    setSnapshot(snapshot: SnapShot | null) {
        this.snapshot = snapshot;
    }

    getSnapShot() {
        return this.snapshot;
    }
    compareSnapshots(newSnap: SnapShot) {
        return deepEqual(this.snapshot, newSnap);
    }

    updatePrintCount() {
        this.printCount++;
    }

    getStatistics() {
        return {
            parsedFile: basename(this.file),
            printCount: this.printCount,
        }
    }

    async init() {
        try {
            const snapshot: SnapShot = await parseFile(this.file);
            this.setSnapshot(snapshot);
            this.emit('print', [this.updatePrintCount(), this.snapshot]);
        } catch (error) {
            //handle eror
            console.error(error);
        }
    }


    async watch() {
        const signal = this.signal;
        try {
            await this.init();
            console.log(`Start watching file: ${this.file}`);
            const watcher = fs.watch(this.file, { signal });
            for await (const { eventType } of watcher) {
                if (eventType === 'change') {
                    this.emit('shouldUpdate', await parseFile(this.file));
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return this.terminate(0, 'Process aborted');
                }
                this.terminate(1,error.message);
            }

        }
    }

    async stopWatching() {
        this.ac.abort();
    }

    //refactor to properly handling error
    terminate(code: number, reason: string) {
        console.log(reason);
        process.exit(code);
    }
}

//terminate(0,'process aborted');
//terminate(1,'unHandled Promise');
