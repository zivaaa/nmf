import {EVENT_BOO_BIND_AFTER, EVENT_BOO_BIND_BEFORE, EVENT_BOO_RESOLVE_AFTER, EVENT_BOO_RESOLVE_BEFORE} from "./events.mjs";
import {BIND_APP_PROVIDERS} from "./bindings.mjs";
import * as types from "./types.mjs";

/**
 * @namespace nmf
 */


/**
 * @class Bootstrapper
 * @memberOf nmf
 */
export class Bootstrapper {

    /**
     * @type {nmf.App}
     */
    app = undefined;


    /**
     * @param {nmf.App} app
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * @return {Promise<void>}
     */
    async boot() {
        await this.emitter.emit(EVENT_BOO_BIND_BEFORE);
        await this.bind(this.app.ctx.fetch(BIND_APP_PROVIDERS));
        await this.emitter.emit(EVENT_BOO_BIND_AFTER);

        await this.emitter.emit(EVENT_BOO_RESOLVE_BEFORE);
        await this.resolve(this.app.ctx.fetch(BIND_APP_PROVIDERS));
        await this.emitter.emit(EVENT_BOO_RESOLVE_AFTER);
    }

    /**
     * @param {nmf.Provider|nmf.Provider[]} provider
     * @return {Promise<void>}
     */
    async provide(provider) {
        const providers = Array.isArray(provider) ? provider : [provider];
        await this.bind(providers);
        await this.resolve(providers);
    }

    /**
     * @param {nmf.Provider[]} providers
     * @return {Promise<void>}
     */
    async bind(providers) {
        for await (let provider of providers) {
            await provider.bind(this.app);
        }
    }

    /**
     * @param {nmf.Provider[]} providers
     * @return {Promise<void>}
     */
    async resolve(providers) {
        for await (let provider of providers ) {
            await provider.resolve(this.app);
        }
    }

    /**
     * @private
     * @returns {Emitter}
     */
    get emitter() {
        return this.app.em;
    }

    /**
     * @private
     * @returns {nmf.Context}
     */
    get ctx() {
        return this.app.ctx;
    }
}
