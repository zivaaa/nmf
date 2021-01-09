/**
 * @namespace nmf
 */


/**
 * @memberOf nmf
 */
export class Emitter {
    listeners = new Map();

    async emit(eventName, ...args) {
        const listeners = this.listeners.get(eventName);
        if (listeners) {
            for await (const [func, once] of listeners) {
                let result = false;

                if (func.constructor.name === 'AsyncFunction') {
                    result = await func(...args);
                } else {
                    result = func(...args);
                }

                if (once) {
                    listeners.delete(func);
                }

                if (result === false) {
                    break;
                }
            }
        }
    }

    eventNames() {
        return [...this.listeners.keys()];
    }

    off(eventName, cb) {
        if (this.listeners.has(eventName)) {
            if (cb) {
                const listeners = this.listeners.get(eventName);
                if (listeners.has(cb)) {
                    listeners.delete(cb);
                }
            } else {
                this.listeners.delete(eventName);
            }
        }

        return this
    }

    on(eventName, cb, once) {
        const listeners = this.listeners.get(eventName);

        if (!listeners) {
            this.listeners.set(eventName, new Map([[cb, !!once]]));
        } else {
            listeners.set(cb, !!once);
        }

        return this;
    }

    once(eventName, cb) {
        this.on(eventName, cb, true);
        return this;
    }

    prependOn(eventName, cb, once) {
        const listeners = this.listeners.get(eventName);
        if (!listeners) {
            this.listeners.set(eventName, new Map([[cb, !!once]]));
        } else {
            this.listeners.set(eventName, new Map([
                [cb, !!once],
                ...listeners
            ]));
        }
        return this
    }

    prependOnce(eventName, cb) {
        return this.prependOn(eventName, cb, true);
    }

}

