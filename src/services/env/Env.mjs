import env from 'dotenv-flow';
import path from "path";
import fs from "fs";

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 */
export class Env {
    config = {};

    /**
     * @param {string} root - where to find .env
     * @param {string} mode - where to find .env[mode]
     */
    constructor(root, mode = "") {
        this.load(root, mode);
    }

    /**
     * @param root
     * @param mode
     */
    load(root, mode = "") {
        const config = env.config({ path: root, node_env: mode });
        if (config.error) {
            console.warn(config.error);
        }
    }

    /**
     * @param key
     * @param def
     * @returns {null}
     */
    get(key, def = null) {
        return this.has(key) ? process.env[key] : def;
    }

    /**
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return process.env.hasOwnProperty(key)
    }
}
