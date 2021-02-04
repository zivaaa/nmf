import {nmfTools} from "../../src/tools.mjs";
import {App} from "../../src/App.mjs";
import path from "path";
import chai from 'chai';
const { expect } = chai;
import chaiAsPromised from "chai-as-promised";
import {BIND_ENV} from "../../src/services/env/consts.mjs";
chai.use(chaiAsPromised);


export function fn() {
    describe("app action execution", function () {
        const app = new App({
            root: nmfTools.dirnameIMU(import.meta.url),
            config: app => {
                return {
                    config: {
                        val1: 100,
                        val2: 200,
                    },
                    providers: [],
                    bindings: [
                        {key: "val1", value:100}
                    ],
                    actions: [
                        {
                            name: "test:increment",
                            description: "",
                            fn: async app1 => {
                                const val = app1.ctx.fetch("val1");
                                const val2 = app1.ctx.fetch("app.config.val2");
                                app1.ctx.bind("val1", val + 1);
                                app1.ctx.bind("app.config.val2", val2 + 1);
                            }
                        }
                    ]
                }
            },
        });

        it("bootstrap and emit event, then check result", async function() {
            await expect(app.exec("test:increment")).to.be.fulfilled
            expect(app.ctx.fetch("val1")).to.be.eq(101);
            expect(app.ctx.fetch("app.config.val2")).to.be.eq(201);
        })
    })

    describe("app env testing", function () {
        const app = new App({
            root: nmfTools.dirnameIMU(import.meta.url),
            envPath: path.join(nmfTools.dirnameIMU(import.meta.url), "./testEnv"),
            config: app => {
                return {
                    config: {

                    },
                    providers: [],
                    bindings: [],
                    actions: [
                        {
                            name: "test:hello",
                            description: "",
                            fn: async app1 => {
                                return true;
                            }
                        }
                    ]
                }
            },
        });
        it("test env file set", async function() {
            await expect(app.exec("test:hello")).to.be.fulfilled
            const env = /** @type {nmf.Env} */ app.ctx.fetch(BIND_ENV);
            const a = env.get("NOW_HERE");
            expect(env.get("NOW_HERE")).to.be.eq('100');
        })
    })

}