import env from 'dotenv';
import path from "path";

/**
 * @namespace nmf
 */

/**
 * @memberOf nmf
 */
export class Env {
    config = {};

    constructor(root) {
        const fullPath = path.join(root, ".env");
        this.config = env.config({ path: fullPath });
        if (!this.config) {
            throw new Error(`${fullPath} not found`);
        }

        if (this.config.error) {
            throw this.config.error;
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
