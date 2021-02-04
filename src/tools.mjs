import * as types from "./types.mjs";
import {BIND_ARGV, BIND_ENV} from "./services/env/consts.mjs";
import path from "path";

/**
 * @namespace nmf
 */


/**
 * @memberOf nmf
 * @typedef {Object.<string, any>} nmf.Tools
 * @property {function():string} getCurrentActionName
 * @property {function(key:string,def:any = null):string} env
 * @property {function(key:string,def:any = null):string} getArg
 * @property {function(key:string):boolean} hasArg
 * @property {function(importMetaUrl:string):string} dirnameIMU - get module dirname by import.meta.url
 */

/**
 * @type {nmf.Tools}
 */
export const nmfTools = {
    /**
     * @type {nmf.App}
     */
    _app: null,

    /**
     * @return {nmf.App}
     */
    get app() {
        return this._app;
    },

    /**
     * @return {nmf.Context}
     */
    get ctx() {
        return this._app.ctx;
    },

    env(key, def = null) {
        return (/** @type {nmf.Env} env */ this._app.ctx.fetch(BIND_ENV)).get(key, def);
    },

    getArg(key, def) {
        return (/** @type {nmf.Argv} argv */ this._app.ctx.fetch(BIND_ARGV)).get(key, def);
    },

    hasArg(key) {
        return (/** @type {nmf.Argv} argv */ this._app.ctx.fetch(BIND_ARGV)).has(key);
    },

    getCurrentActionName() {
        return this.ctx.fetch(BIND_ARGV).get("action", "default");
    },
    dirnameIMU(importMetaUrl) {
        return path.dirname(new URL(importMetaUrl).pathname);
    }
};
