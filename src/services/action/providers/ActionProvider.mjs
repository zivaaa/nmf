import {BIND_ACTION_MANAGER, BIND_ACTIONS} from "../consts.mjs";
import ActionManager from "../ActionManager.mjs";
import {EVENT_APP_BEFORE_BOOT} from "../../../events.mjs";


/**
 * @type {nmf.Provider}
 */
export const ActionProvider = {
    async bind(app) {
        app.ctx.bind(BIND_ACTION_MANAGER, new ActionManager(app));
    },
    async resolve(app) {
        const am = /** @type {nmf.ActionManager} */app.ctx.fetch(BIND_ACTION_MANAGER);
        app.em.on(EVENT_APP_BEFORE_BOOT, async () => {
            am.registerAll();
        })
    }
}
