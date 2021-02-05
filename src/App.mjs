import {Bootstrapper} from "./Boostrapper.mjs";
import {Context} from "./Context.mjs";
import {Emitter} from "./Emitter.mjs";
import {
    EVENT_APP_AFTER_BOOT,
    EVENT_APP_BEFORE_BOOT,
    EVENT_APP_ERROR,
    EVENT_APP_EXIT,
    EVENT_APP_PRE_BOOT,
    EVENT_APP_START
} from "./events.mjs";
import {BIND_ARGV, BIND_CONFIG_RESOLVER} from "./services/env/consts.mjs";
import {BIND_ACTION_MANAGER, BIND_ACTIONS} from "./services/action/consts.mjs";
import {EnvProvider} from "./services/env/providers/EnvProvider.mjs";
import {ActionProvider} from "./services/action/providers/ActionProvider.mjs";
import {nmfTools} from "./tools.mjs";
import {BIND_APP_PROVIDERS} from "./bindings.mjs";

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 */
export class App {
    /**
     * @private
     * @type {nmf.Bootstrapper}
     */
    _bootstrapper = undefined;

    /**
     * @type {nmf.Context}
     * @private
     */
    _context = undefined;

    /**
     * @type {nmf.Emitter}
     * @private
     */
    _emitter = undefined;

    /**
     * корень проекта (абсолютный)
     * @type {string}
     * @private
     */
    _root = nmfTools.dirnameIMU(import.meta.url);

    /**
     * @type {nmf.AppConfig}
     * @private
     */
    _config = undefined;

    /**
     * @type {nmf.AppConfigResolverFn}
     * @private
     */
    _configResolver = undefined;

    /**
     * @type {nmf.Env}
     */
    env = undefined;

    /**
     * @type {nmf.Provider[]}
     * @private
     */
    _coreProviders = [
        EnvProvider,
        ActionProvider
    ];

    /**
     * @type {nmf.Tools}
     * @private
     */
    _tools = nmfTools;


    /**
     * @param {nmf.AppConfigResolverFn} configResolver
     */
    constructor(configResolver) {
        this._tools._app = this;
        this._configResolver = configResolver;
        this._bootstrapper = new Bootstrapper(this);
        this._context = new Context();
        this._emitter = new Emitter();
        this.ctx.bind(BIND_CONFIG_RESOLVER, this._configResolver);
    }

    /**
     * @param {nmf.AppConfig} config
     * @private
     */
    _bindConfig(config) {
        if (config.config) {
            Object.keys(config.config).forEach((key) => {
                const configNode = config.config[key];
                this.ctx.bind(`app.config.${key}`, configNode);
            });
        }

        if (config.bindings) {
            for (let i = 0; i < config.bindings.length; i++) {
                const b = config.bindings[i];
                this.ctx.bind(b.key, b.value);
            }
        }

        this.ctx.bind(BIND_APP_PROVIDERS, config.providers || []);

        this.ctx.bind(BIND_ACTIONS, config.actions || []);
    }

    /**
     * полностью загрузить и выполнить поставленную в конфиге задачу
     * @param {string|nmf.Action|null} [action]
     * @param [args]
     * @return {Promise<void>}
     */
    async exec(action = null, ...args) {
        try {
            await this.boot();
            await this.start(action, ...args);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * преднастройка базовых фич
     */
    async preBoot() {
        await this.em.emit(EVENT_APP_PRE_BOOT);
        this._resolveConfig();
        await this.boo.provide(this._coreProviders);
        this._bindConfig(this._configResolver.config(this));

        this._bindHooks();
    }

    /**
     * @private
     */
    _resolveConfig() {
        if (this._configResolver.root) {
            this._root = this._configResolver.root;
        }
        if (this._configResolver.coreProviders) {
            this._coreProviders = this._configResolver.coreProviders;
        }
    }

    /**
     * загрузка модулей
     * @return {Promise<void>}
     */
    async boot() {
        try {
            await this.preBoot();
            await this.em.emit(EVENT_APP_BEFORE_BOOT);
            await this.boo.boot();
            await this.em.emit(EVENT_APP_AFTER_BOOT);
        } catch (e) {
            console.error(e);
            await this.em.emit(EVENT_APP_ERROR, e);
            await this.stop(true);
            throw e;
        }
    }

    /**
     * биндим хуки
     * @private
     */
    _bindHooks() {
        // const config = this.config;
        // const hooks = config.hooks;
        //
        // for (let i = 0; i < hooks.length; i++) {
        //     const hook = new hooks[i](this);
        //     const hookItems = hook.getHooks();
        //     for (let j = 0; j < hookItems.length; j++) {
        //         this.emitter.on(hookItems[i].event, hookItems[i].fn);
        //     }
        // }
    }

    /**
     * fire passed (or action from command line args) action, check if need to stop
     *
     * @param {nmf.Action|string|null} [action]
     * @param [args]
     * @return {Promise<void>}
     */
    async start(action, ...args) {
        const actionName = !action ? this.tools.getCurrentActionName() : action;
        await this.em.emit(EVENT_APP_START, actionName, ...args);

        let needStop = false;
        try {
            needStop = await this.fire(actionName, ...args);
        } catch (e) {
            console.error(e);
            await this._emitter.emit(EVENT_APP_ERROR, e);
            needStop = true;
        }

        if (needStop) {
            await this.stop(false);
        }
    }

    /**
     * @param {boolean} fail
     */
    kill(fail = false) {
        process.exit(fail ? 1 : 0)
    }

    async stop(fail = false) {
        await this.em.emit(EVENT_APP_EXIT);
    }

    /**
     * @param fail
     * @return {Promise<void>}
     */
    async stopAndKill(fail) {
        try {
            await this.stop(fail);
        } catch (e) {
            console.error(e);
        }
        this.kill(fail);
    }

    /**
     * запустить задачу
     * @param {nmf.Action|string|undefined} action
     * @param [args]
     * @return {Promise<void>}
     */
    async fire(action,...args) {
        const am = /** @type {nmf.ActionManager} */ this.ctx.fetch(BIND_ACTION_MANAGER);

        if (typeof action === "object") {
            am.register(action);
        }

        return await am.fire(action, ...args);
    }


    /**
     * @return {Emitter}
     */
    get em() {
        return this._emitter;
    }

    /**
     * @return {nmf.Bootstrapper}
     */
    get boo() {
        return this._bootstrapper;
    }

    /**
     * @return {nmf.Context}
     */
    get ctx() {
        return this._context;
    }

    /**
     * @returns {string}
     */
    get root() {
        return this._root;
    }

    /**
     * @return {nmf.Tools}
     */
    get tools() {
        return this._tools;
    }
}