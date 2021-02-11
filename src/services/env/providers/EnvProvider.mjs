import {BIND_ARGV, BIND_CONFIG_RESOLVER, BIND_ENV, BIND_ENV_PATH} from "../consts.mjs";
import {Env} from "../Env.mjs";
import {Argv} from "../Argv.mjs";

/**
 * @type {nmf.Provider}
 */
export const EnvProvider = {
    async bind(app) {
        const env = this.envClass();
        const resolver = app.ctx.fetch(BIND_CONFIG_RESOLVER);
        const envPath = resolver.envPath ? resolver.envPath : process.env.ENV_PATH;
        app.ctx.bind(BIND_ENV, new env(envPath ? envPath : app.root, process.env.NODE_ENV || "production"))

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
