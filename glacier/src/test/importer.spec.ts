/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";
import {satisfies} from "../util";
import {DOMParser} from "xmldom";
import {evaluate, XPathResult} from "xpath";
import {Store} from "redux";
import * as fs from "fs";
import {resolve} from "path";
import * as jszip from "jszip";

function root(parts: TemplateStringsArray, ...inserts: string[]) {
    let result = "";
    for (let i = 0; i < inserts.length; i++) {
        result += parts[i];
        result += inserts[i];
    }
    result += parts[parts.length - 1];
    return resolve(__dirname, "../../../", result);
}

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
        fs.writeFile(root`./data/baselines/local/${name}.svg`, actualString, err => {
            if (err) return reject(err);
            fs.readFile(root`./data/baselines/reference/${name}.svg`, (err, xml) => {
                if (err) return reject(new Error(`Reference baseline for ${name} does not yet exist!`));

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
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "quantitative"}),
            glacier.createAddChannelAction("y", {field: "ListPrice", type: "quantitative"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("1-structuredData", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change mark type", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("line"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "quantitative"}),
            glacier.createAddChannelAction("y", {field: "ListPrice", type: "quantitative"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("2-marks", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change size", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(100, 900),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "quantitative"}),
            glacier.createAddChannelAction("y", {field: "ListPrice", type: "quantitative"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("3-size", await exporter.export());
        await adapter.remove();
    });

    it("should be usable to change encoding", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("y", {field: "DaysToManufacture", type: "quantitative"}),
            glacier.createAddChannelAction("x", {field: "ListPrice", type: "quantitative"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("4-encoding", await exporter.export());
        await adapter.remove();
    });

    it("should be able to change description", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot break"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "quantitative"}),
            glacier.createAddChannelAction("y", {field: "ListPrice", type: "quantitative"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("1-structuredData", await exporter.export()); // NOT A BUG - uses the same baseline as the first baseline
        await adapter.remove();
    });

    it("should create an action to add fields", () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const fields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(fields)
        );
        let state = model.getState();

        for (const f of fields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        }
    });

    it("should create an action to remove fields", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}];
        const removeFields = [{name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "ordinal", scale: {bandSize: 20}}),
            glacier.createAddChannelAction("y", {field: "Weight", type: "quantitative"})
        );
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);

        const expectedFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}];
        for (const f of expectedFields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        };

        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("5-Product Weight", await exporter.export());
        await adapter.remove();
    });

    it("should create an action to remove fields by id", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction(
            [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}]
        );
        const removeFields = glacier.createRemoveFieldsAction([addFields.payload.fields[1]]);
        dispatchSequence(model,
            addFields,
            removeFields,
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "ordinal", scale: {bandSize: 20}}),
            glacier.createAddChannelAction("y", {field: "Weight", type: "quantitative"})
        );
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);

        const expectedFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}];
        for (const f of expectedFields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        };

        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline("5-Product Weight", await exporter.export()); // NOT A BUG - uses the same baseline as the fifth baseline
        await adapter.remove();
    });
    it("should export svg to bundle", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}];
        const removeFields = [{name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("area"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "ordinal", scale: {bandSize: 20}}),
            glacier.createAddChannelAction("y", {field: "Weight", type: "quantitative"})
        );

        const glacierLib = fs.readFileSync(root`./glacier/dist/local/glacier.js`);
        const indexHtml = fs.readFileSync(root`./data/index.html`);
        const exportedBundle = glacier.createZipExporter(model, {"glacier.js": glacierLib, "index.html": indexHtml});
        await adapter.updateCache();
        const zip = await exportedBundle.export();
        const loadedZip = await new jszip().loadAsync(zip);
        const thumnailString = await loadedZip.files["thumnail.svg"].async("string");
        await baseline("6-Exported-Thumnail", thumnailString);
        await adapter.remove();
    });
    it("should export other files to bundle", async() => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{name: "DaysToManufacture", table: "Product", dataSource: adapter.id}, {name: "ListPrice", table: "Product", dataSource: adapter.id}, {name: "Weight", table: "Product", dataSource: adapter.id}];
        const removeFields = [{name: "ListPrice", table: "Product", dataSource: adapter.id}];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", {field: "DaysToManufacture", type: "ordinal", scale: {bandSize: 20}}),
            glacier.createAddChannelAction("y", {field: "Weight", type: "quantitative"})
        );

        const glacierLib = fs.readFileSync(root`./glacier/dist/local/glacier.js`);
        const indexHtml = fs.readFileSync(root`./data/index.html`);
        const exportedBundle = glacier.createZipExporter(model, {"glacier.js": glacierLib, "index.html": indexHtml});
        await adapter.updateCache();
        const zip = await exportedBundle.export();
        const loadedZip = await new jszip().loadAsync(zip);
        const files = Object.keys(loadedZip.files);
        expect(files).to.contain("index.html");
        expect(files).to.contain("glacier.js");
        expect(files).to.contain("thumnail.svg");
        expect(files).to.contain("state.json");
        await adapter.remove();
    });

    it("should enable consumers to join data from multiple sources", async () => {
        let model = glacier.createModel();
        const carSource = glacier.createMemoryDataSource(model);
        carSource(require(root`./data/cars.json`));
        const djiSource = glacier.createMemoryDataSource(model);
        const djiCsv = fs.readFileSync(root`./data/dji.csv`).toString();
        const [headerString, ...rows] = djiCsv.split("\n");
        const header = headerString.split(",");
        const djiData = rows.map(r => r.split(",")).map(r => {
            const datum = {} as {[index: string]: string};
            header.forEach((h, i) => {
                datum[h] = r[i];
            });
            return datum;
        }) as {Date: string, Open: string, Close: string, High: string, Low: string, Volume: string}[];
        djiSource(djiData.map(d => ({year: +d.Date.substring(0, 4), close: +d.Close, open: +d.Open, low: +d.Low, high: +d.High, volume: +d.Volume})));
        const addFields = glacier.createAddFieldsAction([
            {name: "Name", dataSource: carSource.id}, {name: "Miles_per_Gallon", dataSource: carSource.id}, {name: "Year", dataSource: carSource.id},
            {name: "year", dataSource: djiSource.id}, {name: "high", dataSource: djiSource.id}
        ]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("MPG v DJI"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddJoinAction(addFields.payload.fields[2].id, addFields.payload.fields[3].id),
            glacier.createAddChannelAction("x", {field: addFields.payload.fields[1].id, type: "quantitative", axis: { title: "MPG" }}),
            glacier.createAddChannelAction("y", {field: addFields.payload.fields[4].id, type: "quantitative", axis: { title: "Dow Jones Indstrial Average" }})
        );
        const exporter = glacier.createSvgExporter(model);

        await carSource.updateCache();
        await djiSource.updateCache();
        await baseline("7-MPGvDJI", await exporter.export());
        await carSource.remove();
        await djiSource.remove();
    });
});