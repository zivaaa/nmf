import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 */
export class Argv {
    /**
     * @param arg
     * @param def
     * @return {*}
     */
    get(arg, def = null) {
        return yargs(process.argv)
            .default(arg, def)
            .argv[arg];
    }

    /**
     * @param arg
     * @return {boolean}
     */
    has(arg) {
        return yargs(process.argv).argv[arg] !== undefined;
    }

    /**
     * @return {YargsWithShim}
     */
    yargs() {
        return yargs
    }
}
