import {BIND_ACTIONS, EVENT_ACTION_FIRE} from "./consts.mjs";
import {defaultActions} from "./actions.mjs";

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 * @class ActionManager
 */
export default class ActionManager {
    /**
     * @type {nmf.App}
     */
    _app = undefined;

    /**
     * @type {Map<string, nmf.Action>}
     * @private
     */
    _actions = new Map();

    /**
     * @param {nmf.App} app
     */
    constructor(app) {
        this._app = app;
    }


    /**
     * @return {nmf.ActionManager}
     */
    registerAll() {
        const actions = this._app.ctx.fetch(BIND_ACTIONS);

        defaultActions.forEach(a => {
            this.register(a);
        })

        if (!actions) {
            console.warn("no actions defined. did u miss it?");
            return;
        }

        actions.forEach((a) => {
            this.register(a);
        });

        return this;
    }

    /**
     * @param {nmf.Action} action
     * @return {nmf.ActionManager}
     */
    register(action) {
        if (this.doesActionRegistered(action.name)) {
            console.warn(`${action.name} already registered. will override it`);
        }

        this._actions.set(action.name, action);
        return this;
    }

    /**
     * @param {string} actionName
     * @param [args]
     * @returns {Promise<void>}
     */
    async fire(actionName, ...args) {
        if (!this.doesActionRegistered(actionName)) {
            throw new Error(`unknown action - ${actionName}`);
        }

        const action = this.getAction(actionName);
        await this._app.em.emit(EVENT_ACTION_FIRE, action.name, ...args);
        return await action.fn(this._app, ...args);
    }


    /**
     * @return {IterableIterator<nmf.Action>}
     */
    all() {
        return this._actions.values();
    }

    /**
     * @param name
     * @returns {nmf.Action}
     */
    getAction(name) {
        return this._actions.get(name);
    }

    /**
     * @param actionName
     * @return {boolean}
     */
    has(actionName) {
        return this.doesActionRegistered(actionName);
    }
    /**
     * @param actionName
     * @return {boolean}
     */
    doesActionRegistered(actionName) {
        return this._actions.has(actionName);
    }
}
