import yargs from 'yargs';

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 */
export class Argv {
    get(arg, def = null) {
        const a = yargs(process.argv)
            .default(arg, def)
            .argv[arg];
        return a;
    }
}
