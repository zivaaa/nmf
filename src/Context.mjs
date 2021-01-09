import * as types from "./types.mjs";

/**
 * @namespace nmf
 */


/**
 * @memberOf nmf
 * @class Context
 */
export class Context {
    s = new Map();

    /**
     * @param key
     * @param val
     * @return {nmf.Context}
     */
    bind(key, val) {
        this.s.set(key, val);
        return this;
    }

    /**
     * @param key
     * @returns {nmf.Context}}
     */
    unbind(key) {
        delete this.s.delete(key);
        return this;
    }

    /**
     * @param {Object} obj
     * @return {nmf.Context}}
     */
    bindAll(obj) {
        for (let key in obj) {
            this.bind(key, obj[key]);
        }

        return this;
    }

    /**
     * @param key
     * @return {*}
     */
    fetch(key) {
        return this.s.get(key);
    }

    /**
     * @param key
     * @return {boolean}
     */
    has(key) {
        return this.s.has(key);
    }

}
