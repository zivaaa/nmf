import {BIND_ARGV, BIND_ENV} from "../consts.mjs";
import {Env} from "../Env.mjs";
import {Argv} from "../Argv.mjs";

/**
 * @type {nmf.Provider}
 */
export const EnvProvider = {
    async bind(app) {
        const env = this.envClass();
        app.ctx.bind(BIND_ENV, new env(app.root))

        const argv = this.argvClass();
        app.ctx.bind(BIND_ARGV, new argv())
    },
    async resolve(app) {

    },
    envClass() {
        return Env;
    },
    argvClass() {
        return Argv
    }
}
