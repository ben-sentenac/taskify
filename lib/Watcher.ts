import { EventEmitter } from "stream";
import { SnapShot } from "./types/types.js";
import { deepEqual } from "./utils.js";
import { parseFile } from "./taskParser.js";
import fs from 'node:fs/promises';

export class Watcher extends EventEmitter {
    protected file: string;
    protected snapshot: SnapShot | null;
    public shoulUpdate: boolean;
    protected printCount: number;

    constructor(file: string) {
        super();

        this.file = file;
        this.snapshot = null;
        this.shoulUpdate = false;
        this.printCount = 0;
    }

    setSnapshot(snapshot: SnapShot) {
        this.snapshot = snapshot;
    }

    getSnapShot() {
        return this.snapshot;
    }
    compareSnapshots(currentSnap: SnapShot, newSnap: SnapShot) {
        return deepEqual(currentSnap, newSnap);
    }

    updatePrintCount() {
        this.printCount++;
    }

    async init() {
        try {
            const snapshot = await parseFile(this.file);
            this.setSnapshot(snapshot);
            this.emit('print', [this.updatePrintCount(), this.snapshot]);
        } catch (error) {
            //handle eror
            console.error(error);
        }
    }


    async watch() {
     try {
          await this.init();
          console.log(`Start watching file: ${this.file}`);
          const watcher = fs.watch(this.file);
          for await (const { eventType} of watcher) {
            if(eventType === 'change') {
                this.emit('shouldUpdate',await parseFile(this.file));
            }
          }
     } catch (error) {
        throw error;
     }     
    }
}