/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";
import {DOMParser} from "xmldom";
import {evaluate, XPathResult} from "xpath";

describe("A smoke test suite", () => {
    it("should pass", () => {
        expect(true).to.equal(true);
    });
    it("should be importing glacier", () => {
        expect(glacier).to.exist;
    });
});

describe("glacier as a model", () => {
    it("should expose a data source", () => {
        expect(glacier.createSqlFileDataSource).to.exist;
    });
    it("should expose an evented model");
    it("should be usable as a tool to consume structured data and emit visualizations", () => {
        const model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        const exporter = glacier.createSvgExporter(model);
        // TODO: Update this example to appropriately insert encodings once encodings are held within the store

        return adapter.updateCache().then(() => exporter.export()).then(value => {
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/visualization.svg").toString();
            
            const parser = new DOMParser();
            const expected = parser.parseFromString(xml, "image/svg+xml");
            const actual = parser.parseFromString(value, "image/svg+xml");
            const expectedTextResult = evaluate("//*[local-name() = 'text']", expected, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
            const actualTextResult = evaluate("//*[local-name() = 'text']", actual, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

            let textElements = 0;
            while (true) {
                const expectedText = expectedTextResult.iterateNext();
                const actualText = actualTextResult.iterateNext();
                if (expectedText == null && actualText == null) {
                    break;
                }
                else if (expectedText == null) {
                    throw new Error("More actual elements than expected");
                }
                else if (actualText == null) {
                    throw new Error("More expected elements than actual");
                }

                textElements++;
                expect(actualText.textContent).to.equal(expectedText.textContent);
            }
            expect(textElements).to.be.greaterThan(0);
            expect(evaluate("//g", actual, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength).to.equal(evaluate("//g", expected, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength);
            expect(evaluate("//*", actual, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength).to.equal(evaluate("//*", expected, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength);
            return adapter.remove();
        });
    });
});