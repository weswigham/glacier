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

    it("should be usable as a tool to consume structured data and emit visualizations", (done: (err?: any) => void) => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateMarkTypeAction('point'));
        model.dispatch(glacier.createUpdateDescriptionAction('Test Plot'));
        model.dispatch(glacier.createUpdateSizeAction(255, 264));
        model.dispatch(glacier.createUpdateEncodingAction({
            x: {field: "DaysToManufacture", type: "quantitative"},
            y: {field: "ListPrice", type: "quantitative"}
        }));
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        adapter.updateCache().then(() => exporter.export()).then(value => {
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/test4.svg").toString();
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
        }).then(() => adapter.remove()).then(done, done);
    });
    it("should be usable to change mark type", (done: (err?: any) => void) => {
        debugger;
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateMarkTypeAction('line'));
        model.dispatch(glacier.createUpdateDescriptionAction('Test Plot'));
        model.dispatch(glacier.createUpdateSizeAction(255, 264));
        model.dispatch(glacier.createUpdateEncodingAction({
            x: {field: "DaysToManufacture", type: "quantitative"},
            y: {field: "ListPrice", type: "quantitative"}
        }));
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        adapter.updateCache().then(() => exporter.export()).then(value => {
            debugger;
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/test5.svg").toString();
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
            
        }).then(() => adapter.remove()).then(done, done);
    });
        it("should be usable to change size", (done: (err?: any) => void) => {
        debugger;
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateMarkTypeAction('point'));
        model.dispatch(glacier.createUpdateDescriptionAction('Test Plot'));
        model.dispatch(glacier.createUpdateSizeAction(100, 900));
        model.dispatch(glacier.createUpdateEncodingAction({
            x: {field: "DaysToManufacture", type: "quantitative"},
            y: {field: "ListPrice", type: "quantitative"}
        }));
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        adapter.updateCache().then(() => exporter.export()).then(value => {
            debugger;
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/test6.svg").toString();
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
            
        }).then(() => adapter.remove()).then(done, done);
    });
        it("should be usable to change encoding", (done: (err?: any) => void) => {
        debugger;
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateMarkTypeAction('point'));
        model.dispatch(glacier.createUpdateDescriptionAction('Test Plot'));
        model.dispatch(glacier.createUpdateSizeAction(255, 264));
        model.dispatch(glacier.createUpdateEncodingAction({
            y: {field: "DaysToManufacture", type: "quantitative"},
            x: {field: "ListPrice", type: "quantitative"}
        }));
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        adapter.updateCache().then(() => exporter.export()).then(value => {
            debugger;
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/test7.svg").toString();
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
            
        }).then(() => adapter.remove()).then(done, done);
    });
    it("should be able to change description", (done: (err?: any) => void) => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateMarkTypeAction('point'));
        model.dispatch(glacier.createUpdateDescriptionAction('Test Plot break'));
        model.dispatch(glacier.createUpdateSizeAction(255, 264));
        model.dispatch(glacier.createUpdateEncodingAction({
            x: {field: "DaysToManufacture", type: "quantitative"},
            y: {field: "ListPrice", type: "quantitative"}
        }));
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        adapter.updateCache().then(() => exporter.export()).then(value => {
            expect(value).to.be.a("string");
            const xml = require("fs").readFileSync("../data/test4.svg").toString();
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
        }).then(() => adapter.remove()).then(done, done);
    });
});