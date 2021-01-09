import {fn as env} from "./env/index.mjs";
import {fn as basic} from "./basic/index.mjs";

async function test() {
    await env();
    await basic();
}

test();