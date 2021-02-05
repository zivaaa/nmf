import * as types from "../../types.mjs";
import {BIND_ACTION_MANAGER} from "./consts.mjs";



/**
 * @type {nmf.Action[]}
 */
export const defaultActions = [
    {
        name: "default",
        async fn(app) {
            await app.fire("list");
            return true;
        }
    },
    {
        name: "list",
        async fn(app) {
            const am = /** @type {nmf.ActionManager} */ app.ctx.fetch(BIND_ACTION_MANAGER);
            console.log("### AVAILABLE ACTIONS ###");
            console.log("");
            for (let act of am.all()) {
                console.log(`# ${act.name}`);
                if (act.description) {
                    console.log(`|-> ${act.description}`);
                }
                console.log(``);
            }
            console.log("");
            return true;
        }
    }
];