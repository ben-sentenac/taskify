import { Readable } from "stream";
import { SnapShot } from "./types/types.js";
import { MultiBar, Presets } from 'cli-progress';
import cliColor from 'cli-color';
export default class Printer {
    snapShot: SnapShot;
    multibar: MultiBar

    constructor(snapShot: SnapShot) {

        this.snapShot = snapShot;

        this.multibar = new MultiBar({
            clearOnComplete: false,
            hideCursor: true,
            format: '{section} ' + cliColor.greenBright.bgWhiteBright('{bar}') + ' | {filename} |  {value} % completed\n',
        }, Presets.shades_classic);
    }
    async print() {
        // todo
        
    }
}
