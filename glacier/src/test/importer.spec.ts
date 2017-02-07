/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";
import {DOMParser} from "xmldom";
import {evaluate, XPathResult} from "xpath";
import {Store} from "redux";
import * as fs from "fs";

describe("A smoke test suite", () => {
    it("should pass", () => {
        expect(true).to.equal(true);
    });
    it("should be importing glacier", () => {
        expect(glacier).to.exist;
    });
});

/* tslint:disable:no-null-keyword */
// XML parser and DOM document APIs require the usage of null :(
function baseline(name: string, actualString: string): Promise<{expected: Document, actual: Document}> {
    expect(actualString).to.be.a("string");
    return new Promise((resolve, reject) => {
        fs.writeFile(`../data/baselines/local/${name}.svg`, actualString, err => {
            if (err) reject(err);
            fs.readFile(`../data/baselines/reference/${name}.svg`, (err, xml) => {
                if (err) return reject(err);

                try {
                    const parser = new DOMParser();
                    const expected = parser.parseFromString(xml.toString(), "image/svg+xml");
                    const actual = parser.parseFromString(actualString, "image/svg+xml");
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

                    return resolve({expected, actual});
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    });
}
/* tslint:enable:no-null-keyword */

function dispatchSequence(model: Store<glacier.ModelState>, ...actions: glacier.AllActions[]) {
    actions.forEach(action => model.dispatch(action));
}

describe("glacier as a model", () => {
    it("should expose a data source", () => {
        expect(glacier.createSqlFileDataSource).to.exist;
    });
    it("should expose an evented model");

    it("should be usable as a tool to consume structured data and emit visualizations", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        dispatchSequence(model,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createUpdateEncodingAction({
                x: {field: "DaysToManufacture", type: "quantitative"},
                y: {field: "ListPrice", type: "quantitative"}
            })
        );
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        await adapter.updateCache();
        await baseline("1-structuredData", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change mark type", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        dispatchSequence(model,
            glacier.createUpdateMarkTypeAction("line"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createUpdateEncodingAction({
                x: {field: "DaysToManufacture", type: "quantitative"},
                y: {field: "ListPrice", type: "quantitative"}
            })
        );
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        await adapter.updateCache();
        await baseline("2-marks", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change size", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        dispatchSequence(model,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(100, 900),
            glacier.createUpdateEncodingAction({
                x: {field: "DaysToManufacture", type: "quantitative"},
                y: {field: "ListPrice", type: "quantitative"}
            })
        );
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        await adapter.updateCache();
        await baseline("3-size", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change encoding", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        dispatchSequence(model,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createUpdateEncodingAction({
                y: {field: "DaysToManufacture", type: "quantitative"},
                x: {field: "ListPrice", type: "quantitative"}
            })
        );
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        await adapter.updateCache();
        await baseline("4-encoding", await exporter.export());
        await adapter.remove();
    });

    it("should be able to change description", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        dispatchSequence(model,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot break"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createUpdateEncodingAction({
                x: {field: "DaysToManufacture", type: "quantitative"},
                y: {field: "ListPrice", type: "quantitative"}
        })
        );
        const exporter = glacier.createSvgExporter(model, (adapter as any)._uuid);

        await adapter.updateCache();
        await baseline("1-structuredData", await exporter.export()); // NOT A BUG - uses the same baseline as the first baseline
        await adapter.remove();
    });

    it("should create an action to add fields", () => {
        let model = glacier.createModel();
        const fields = [{name: "name1", table: "table1"}, {name: "name2", table: "table2"}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(fields, "test")
        );
        let state = model.getState();

        let expectName = fields[0].name;
        let actualName = state.fields.fields[0].name;
        expect(actualName).to.equal(expectName);

        let expectTable = fields[0].table;
        let actualTable = state.fields.fields[0].table;
        expect(actualTable).to.equal(expectTable);

        expect(state.fields.fields.length).to.equal(fields.length);
    });

    it("should create an action to remove fields", () => {
        let model = glacier.createModel();
        const addFields = [{name: "name1", table: "table1"}, {name: "name2", table: "table2"}];
        const removeFields = [{name: "name2", table: "table2"}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields, "test"),
            glacier.createRemoveFieldsAction(removeFields, "test")
        );
        let state = model.getState();
        expect(state.fields.fields.length).to.equal(1);

        let expectName = addFields[0].name;
        let actualName = state.fields.fields[0].name;
        expect(actualName).to.equal(expectName);

        let expectTable = addFields[0].table;
        let actualTable = state.fields.fields[0].table;

        expect(actualTable).to.equal(expectTable);
    });
});