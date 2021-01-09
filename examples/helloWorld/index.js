import {App} from "../../index.mjs";
import {nmfTools} from "../../src/tools.mjs";

const app = new App({
    root: nmfTools.dirnameIMU(import.meta.url),
    config: function(app1) {
        return {
            config: {},
            providers: [],
            bindings: []
        }
    }
});

app.exec();