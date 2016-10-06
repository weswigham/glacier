/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";

describe("A smoke test suite", () => {
    it("should pass", () => {
        expect(true).to.equal(true);
    });
    it("should be importing glacier", () => {
        expect(glacier).to.exist;
    });
});
