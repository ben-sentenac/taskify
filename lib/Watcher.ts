import { EventEmitter } from "node:events";
import { SnapShot } from "./types/types.js";
import { deepEqual } from "./utils.js";
import { parseFile } from "./taskParser.js";
import fs from 'node:fs/promises';
import { basename } from "node:path";
import { Stats, createReadStream } from "node:fs";
import { createHash } from "node:crypto";

//TODO consider checking if file exits and limit extention name 
export class Watcher extends EventEmitter {
    protected file: string;
    protected snapshot: SnapShot | null;
    public shoulUpdate: boolean;
    protected printCount: number;
    readonly ac: AbortController;
    readonly signal: AbortSignal;
    //file state
    protected fileStats:Stats;

    protected fileHash:string | null;


    constructor(file: string) {
        super();
        if(file === undefined || typeof file !== 'string') {
            throw new TypeError('Argument file must be a string');
        }
        this.file = file;
        this.snapshot = null;
        this.shoulUpdate = false;
        this.printCount = 0;
        this.ac = new AbortController();
        this.signal = this.ac.signal;
        this.fileHash = null;
    }

    setSnapshot(snapshot: SnapShot | null) {
        this.snapshot = snapshot;
    }

    hashFileContent(file:string | void): Promise<string> {
        let _file:string;
        if(typeof file === undefined || typeof file !== 'string' ) {
            _file = this.file;
        } else {
            _file = file;
        }
        return new Promise((resolve, reject) => {
            const fileStream = createReadStream(_file);
            const hash = createHash('sha256');
            fileStream.on('readable', () => {
                let chunk;

                while (null !== (chunk = fileStream.read())) {
                    //update hash 
                    hash.update(chunk);
                }

            });

            fileStream.on('end', () => {
                resolve(hash.digest('hex'));
            });

            fileStream.on('error', (error: Error) => {
                reject(error);
            });
        })
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

    async getFileStats () {
       return await fs.stat(this.file);
    }

    async init() {
        try {
            this.fileHash = await this.hashFileContent();
            this.fileStats = await this.getFileStats();
            const snapshot: SnapShot = await parseFile(this.file);
            this.setSnapshot(snapshot);
            this.emit('print', [this.updatePrintCount(), this.snapshot]);
        } catch (error) {
            //handle eror
            console.error(error);
        }
    }

    /**
     * TODO:
     * Change workflow of the watch method to improve performance
     * 
     * New workflow:
     * File Watching:
     * When the file is saved, check the file's hash or metadata.
     * Hashing Check:
     * If the hash or file size has not changed, do nothing (skip parsing).
     *  If the hash or size has changed, proceed to the next step.
     *  Snapshot Parsing and Comparison:
     *  Parse the content of the file into a new snapshot (tasks and statuses).
     * Compare the new snapshot with the previous snapshot using deepEqual or similar.
     * Progress Calculation:
     * If the snapshots are different, calculate the progress of tasks (percentage completed) and update the console.
     *  Statistics:
     * Increment printCount whenever the snapshot is updated, track progress over time, and display relevant statistics.
     * 
     * 
     * Read Once, Check Once:
    * Compute the hash first. If the hash hasn’t changed since the last save, you can safely skip parsing.
     * Only if the hash changes, proceed to parse the file into a snapshot. This means you only read the file content fully once when it changes.
     * 
     * 
     * Option 2: Lightweight Snapshot Checks
    *  Store Minimal Metadata:
    * Instead of a complete snapshot, consider storing minimal task progress metadata (like completed tasks count, total tasks, etc.).
    *This minimizes the need for deep comparisons, and you can simply compare numbers.
     * 
     * 
     * 
     * 
     * 
     *  
     */

    async watch() {
        const signal = this.signal;
        try {
            await this.init();
            console.log(`Start watching file: ${this.file}`);
            const watcher = fs.watch(this.file, { signal });
            for await (const { eventType } of watcher) {              
                if (eventType === 'change') {
                    const newFileStats = await this.getFileStats();
                    const newHash = await this.hashFileContent();
                    //TODO 
                    //also check meta data ? to optimize time 
                    if(this.fileStats.size !== newFileStats.size  || newHash !== this.fileHash) {
                        this.emit('shouldUpdate', await parseFile(this.file));
                        this.fileHash = newHash;
                        this.fileStats = newFileStats;
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return this.terminate(0, 'Process aborted');
                }
                this.terminate(1, error.message);
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
