import { EventEmitter } from "node:events";
import fs from 'node:fs/promises';
import { basename } from "node:path";
import { Stats, createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { parseTaskFromFile } from "./taskParser.js";

//TODO consider checking if file exits and limit extention name 
export class Watcher extends EventEmitter {
    protected file: string;
    protected printCount: number;
    readonly ac: AbortController;
    readonly signal: AbortSignal;
    protected fileHash:string | null;
    protected fileStats:Stats | null;
    protected readonly startWatchingMessage:string;
    protected abortMessage:string;

    constructor(file: string) {
        super();
        if(file === undefined || typeof file !== 'string') {
            throw new TypeError('Argument file must be a string');
        }
        this.file = file;
        this.printCount = 0;
        this.ac = new AbortController();
        this.signal = this.ac.signal;
        this.fileHash = null;
        this.fileStats = null;
        this.startWatchingMessage = `Watching file ${basename(this.file)}`;
        this.abortMessage = 'Process Aborted!';
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

    updatePrintCount() {
        return this.printCount++;
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
            this.emit('update', this.updatePrintCount(),parseTaskFromFile({file:this.file}));
        } catch (error) {
            //handle eror
            console.error('ERROR',error);
            throw error;
        }
    }

    async checkFileChange ():Promise<boolean> {
        const newFileStats = await this.getFileStats();
        const newHash = await this.hashFileContent();
        //also check meta data ? to optimize time 
        if(newHash !== this.fileHash) {
            this.emit('update',this.updatePrintCount(), parseTaskFromFile({file:this.file}));
            this.fileHash = newHash;
            this.fileStats = newFileStats;
            return true;
        }
        return false;
    }

    async watch() {
        const signal = this.signal;
        try { 
            await this.init();
            const watcher = fs.watch(this.file, { signal });
            for await (const { eventType } of watcher) {              
                if (eventType === 'change') {
                    await this.checkFileChange();
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    return this.terminate(0, this.abortMessage);
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

