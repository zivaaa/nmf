import {nmfTools} from "../../src/tools.mjs";
import {App} from "../../src/App.mjs";


import chai from 'chai';
const { expect } = chai;
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);


export function fn() {
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


    describe("app action execution", function () {
        it("bootstrap and emit event, then check result", async function() {
            await expect(app.exec("test:increment")).to.be.fulfilled
            expect(app.ctx.fetch("val1")).to.be.eq(101);
            expect(app.ctx.fetch("app.config.val2")).to.be.eq(201);
        })
    })

}