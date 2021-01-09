import chai from 'chai';

const { expect } = chai;
import {Env} from "../../src/services/env/Env.mjs";
import {dirname} from "../tools.mjs";

export function fn() {
    describe('testing loading env variables from .env_a', function() {
        /**
         * @type {nmf.Env}
         */
        let env = undefined;

        it('loading env', function() {
            expect(() => {
                env = new Env(dirname(import.meta.url));
            }).not.throws()
        });

        it('reading env variables', function() {
            expect(process.env.TEST_VAR).to.be.eq("success");
            expect(env.get("TEST_VAR")).to.be.eq("success");
            expect(process.env.NOT_TEST_VAR).to.be.undefined;
            expect(env.get("NOT_TEST_VAR")).not.to.be.ok;
        });
    });
}