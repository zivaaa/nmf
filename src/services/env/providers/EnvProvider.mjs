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

        const argv = this.argvClass();
        const argvInstance = new argv();
        app.ctx.bind(BIND_ARGV, argvInstance)

        const envPath = resolver.envPath ? resolver.envPath : process.env.ENV_PATH;

        let mode = "production";

        if (process.env.NODE_ENV) {
            mode = process.env.NODE_ENV;
        }

        const argMode = argvInstance.get("mode");
        if (argMode) {
            mode = argMode;
        }

        process.env.NODE_ENV = mode;
        app.ctx.bind(BIND_ENV, new env(envPath ? envPath : app.root, mode));


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
