/// <reference types="mocha" />
import { expect } from "chai";
import * as glacier from "../index";
import { satisfies } from "../util";
import { DOMParser } from "xmldom";
import { evaluate, XPathResult } from "xpath";
import { Store } from "redux";
import * as fs from "fs";
import { resolve } from "path";
import * as jszip from "jszip";

function root(parts: TemplateStringsArray, ...inserts: string[]) {
    let result = "";
    for (let i = 0; i < inserts.length; i++) {
        result += parts[i];
        result += inserts[i];
    }
    result += parts[parts.length - 1];
    return resolve(__dirname, "../../", result);
}

describe("A smoke test suite", () => {
    it("should pass", () => {
        expect(true).to.equal(true);
    });
    it("should be importing glacier", () => {
        expect(glacier).to.exist;
    });
});

function writeFile(path: string, content: string): Promise<{}> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function readFile(path: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        fs.readFile(path, (err, buf) => {
            if (err) return reject(err);
            resolve(buf);
        });
    });
}

/* tslint:disable:no-null-keyword */
// XML parser and DOM document APIs require the usage of null :(
async function baseline_internal(name: string, actualString: string, actualSpec: object | "skip"): Promise<{ expected: Document, actual: Document }> {
    expect(actualString).to.be.a("string");

    await writeFile(root`./data/baselines/local/${name}.svg`, actualString);
    actualSpec !== "skip" ? await writeFile(root`./data/baselines/local/${name}.spec.json`, JSON.stringify(actualSpec, null, 4)) : undefined;

    let xml: Buffer;
    try {
        xml = await readFile(root`./data/baselines/reference/${name}.svg`);
    } catch (e) {
        throw new Error(`Reference svg baseline for ${name} does not yet exist!`);
    }

    let spec: object | undefined = undefined;
    if (actualSpec !== "skip") {
        try {
            spec = JSON.parse((await readFile(root`./data/baselines/reference/${name}.spec.json`)).toString());
        } catch (e) {
            throw new Error(`Reference spec baseline for ${name} does not yet exist!`);
        }
    }

    if (actualSpec !== "skip") {
        if (!spec) throw new Error("No baseline spec loaded!");
        // First, verify spec equality
        expect(JSON.parse(JSON.stringify(actualSpec))).to.deep.equal(spec); // Stringify then parse to strip `undefined` valued keys
    }

    // Then loosely verify svg equality
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

    const delta = 20; // Due to platform differences, sometimes generated sizes are (slightly) different between platforms
    const ewidth = +(expected.documentElement.getAttribute("width") || 0);
    const eheight = +(expected.documentElement.getAttribute("height") || 0);

    const awidth = +(actual.documentElement.getAttribute("width") || 0);
    const aheight = +(actual.documentElement.getAttribute("height") || 0);
    expect(awidth).to.be.closeTo(ewidth, delta);
    expect(aheight).to.be.closeTo(eheight, delta);

    return { expected, actual };


}
/* tslint:enable:no-null-keyword */

function dispatchSequence(model: Store<glacier.ModelState>, ...actions: glacier.AllActions[]) {
    actions.forEach(action => model.dispatch(action));
}

function baseline(
    readableName: string,
    baselineFilename: string,
    makeAdapters: (modelGetter: () => Store<glacier.ModelState>) => glacier.DataAdapter[],
    makeFields: (dataSourceGetter: (count: number) => glacier.DataSourceId) => glacier.Field[],
    makeActions: (fieldGetter: (count: number) => glacier.FieldId) => glacier.AllActions[],
    extraValidation?: (modelGetter: () => Store<glacier.ModelState>, dataSourceGetter: (count: number) => glacier.DataSourceId, fieldGetter: (count: number) => glacier.FieldId) => Promise<any>) {
    it(readableName, async () => {
        const model = glacier.createModel();
        const adapters = makeAdapters(() => model);
        const fields = makeFields(n => adapters[n].id);
        const fieldAction = glacier.createAddFieldsAction(fields);
        const actions = makeActions(n => fieldAction.payload.fields[n].id);
        dispatchSequence(model, fieldAction, ...actions);
        const exporter = glacier.createSvgExporter(model);

        for (const a of adapters) {
            await a.updateCache();
        }
        const {svg, spec} = await exporter.export();
        await baseline_internal(baselineFilename, svg, spec);
        if (extraValidation) {
            await extraValidation(() => model, n => adapters[n].id, n => fieldAction.payload.fields[n].id);
        }
        for (const a of adapters) {
            await a.remove();
        }
    });
}

describe("glacier as a model", () => {
    it("should expose a data source", () => {
        expect(glacier.createSqlFileDataSource).to.exist;
    });
    it("should expose an evented model");

    baseline("should be usable as a tool to consume structured data and emit visualizations",
        "1-structuredData",
        (model) => [glacier.createSqlFileDataSource(model(), root`./data/CycleChain.sqlite`)],
        (source) => [{ name: "DaysToManufacture", table: "Product", dataSource: source(0) }, { name: "ListPrice", table: "Product", dataSource: source(0) }],
        (field) => [
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: "ListPrice", type: "quantitative" })
        ]
    );

    baseline("should be usable to change mark type",
        "2-marks",
        (model) => [glacier.createSqlFileDataSource(model(), root`./data/CycleChain.sqlite`)],
        (source) => [{ name: "DaysToManufacture", table: "Product", dataSource: source(0) }, { name: "ListPrice", table: "Product", dataSource: source(0) }],
        (field) => [
            glacier.createUpdateMarkTypeAction("line"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: "ListPrice", type: "quantitative" })
        ]
    );

    it("should be usable to change size", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(100, 900),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: "ListPrice", type: "quantitative" })
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("3-size", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be usable to change encoding", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("y", { field: "DaysToManufacture", type: "quantitative" }),
            glacier.createAddChannelAction("x", { field: "ListPrice", type: "quantitative" })
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("4-encoding", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to change description", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot break"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: "ListPrice", type: "quantitative" })
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("1-structuredData", (await exporter.export()).svg, "skip"); // NOT A BUG - uses the same baseline as the first baseline
        await adapter.remove();
    });

    it("should create an action to add fields", () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const fields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(fields)
        );
        let state = model.getState();

        for (const f of fields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        }
    });

    it("should create an action to remove fields", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }];
        const removeFields = [{ name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "ordinal", scale: { bandSize: 20 } }),
            glacier.createAddChannelAction("y", { field: "Weight", type: "quantitative" })
        );
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);

        const expectedFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }];
        for (const f of expectedFields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        };

        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("5-Product Weight", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should create an action to remove fields by id", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction(
            [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }]
        );
        const removeFields = glacier.createRemoveFieldsAction([addFields.payload.fields[1]]);
        dispatchSequence(model,
            addFields,
            removeFields,
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "ordinal", scale: { bandSize: 20 } }),
            glacier.createAddChannelAction("y", { field: "Weight", type: "quantitative" })
        );
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);

        const expectedFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }];
        for (const f of expectedFields) {
            expect(satisfies(Object.keys(state.fields).map(k => state.fields[+k]), f2 => f.name === f2.name && f.table === f2.table && f.dataSource === f2.dataSource)).to.exist;
        };

        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("5-Product Weight", (await exporter.export()).svg, "skip"); // NOT A BUG - uses the same baseline as the fifth baseline
        await adapter.remove();
    });
    it("should export svg to bundle", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }];
        const removeFields = [{ name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("area"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "ordinal", scale: { bandSize: 20 } }),
            glacier.createAddChannelAction("y", { field: "Weight", type: "quantitative" })
        );

        const glacierLib = fs.readFileSync(root`./dist/local/glacier.js`);
        const indexHtml = fs.readFileSync(root`./data/index.html`);
        const exportedBundle = glacier.createZipExporter(model, { "glacier.js": glacierLib, "index.html": indexHtml });
        await adapter.updateCache();
        const zip = await exportedBundle.export();
        const loadedZip = await new jszip().loadAsync(zip);
        const thumnailString = await loadedZip.files["thumnail.svg"].async("string");
        await baseline_internal("6-Exported-Thumnail", thumnailString, "skip");
        await adapter.remove();
    });
    it("should export other files to bundle", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = [{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Weight", table: "Product", dataSource: adapter.id }];
        const removeFields = [{ name: "ListPrice", table: "Product", dataSource: adapter.id }];
        dispatchSequence(model,
            glacier.createAddFieldsAction(addFields),
            glacier.createRemoveFieldsAction(removeFields),
            glacier.createUpdateMarkTypeAction("bar"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: "DaysToManufacture", type: "ordinal", scale: { bandSize: 20 } }),
            glacier.createAddChannelAction("y", { field: "Weight", type: "quantitative" })
        );

        const glacierLib = fs.readFileSync(root`./dist/local/glacier.js`);
        const indexHtml = fs.readFileSync(root`./data/index.html`);
        const exportedBundle = glacier.createZipExporter(model, { "glacier.js": glacierLib, "index.html": indexHtml });
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
            const datum = {} as { [index: string]: string };
            header.forEach((h, i) => {
                datum[h] = r[i];
            });
            return datum;
        }) as { Date: string, Open: string, Close: string, High: string, Low: string, Volume: string }[];
        djiSource(djiData.map(d => ({ year: +d.Date.substring(0, 4), close: +d.Close, open: +d.Open, low: +d.Low, high: +d.High, volume: +d.Volume })));
        const addFields = glacier.createAddFieldsAction([
            { name: "Name", dataSource: carSource.id }, { name: "Miles_per_Gallon", dataSource: carSource.id }, { name: "Year", dataSource: carSource.id },
            { name: "year", dataSource: djiSource.id }, { name: "high", dataSource: djiSource.id }
        ]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("MPG v DJI"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddJoinAction(addFields.payload.fields[2].id, addFields.payload.fields[3].id),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[1].id, type: "quantitative", axis: { title: "MPG" } }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[4].id, type: "quantitative", axis: { title: "Dow Jones Indstrial Average" } })
        );
        const exporter = glacier.createSvgExporter(model);

        await carSource.updateCache();
        await djiSource.updateCache();
        await baseline_internal("7-MPGvDJI", (await exporter.export()).svg, "skip");
        await carSource.remove();
        await djiSource.remove();
    });

    it("should enable consumers to filter over data", async () => {
        let model = glacier.createModel();
        const carSource = glacier.createMemoryDataSource(model);
        carSource(require(root`./data/cars.json`));
        const djiSource = glacier.createMemoryDataSource(model);
        const djiCsv = fs.readFileSync(root`./data/dji.csv`).toString();
        const [headerString, ...rows] = djiCsv.split("\n");
        const header = headerString.split(",");
        const djiData = rows.map(r => r.split(",")).map(r => {
            const datum = {} as { [index: string]: string };
            header.forEach((h, i) => {
                datum[h] = r[i];
            });
            return datum;
        }) as { Date: string, Open: string, Close: string, High: string, Low: string, Volume: string }[];
        djiSource(djiData.map(d => ({ year: +d.Date.substring(0, 4), close: +d.Close, open: +d.Open, low: +d.Low, high: +d.High, volume: +d.Volume })));
        const addFields = glacier.createAddFieldsAction([
            { name: "Name", dataSource: carSource.id }, { name: "Miles_per_Gallon", dataSource: carSource.id }, { name: "Year", dataSource: carSource.id },
            { name: "year", dataSource: djiSource.id }, { name: "high", dataSource: djiSource.id }
        ]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("MPG v DJI"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddJoinAction(addFields.payload.fields[2].id, addFields.payload.fields[3].id),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[1].id, type: "quantitative", axis: { title: "MPG" } }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[4].id, type: "quantitative", axis: { title: "Dow Jones Indstrial Average" } }),
            glacier.createSetFilterAction({type: "GT" as any, left: addFields.payload.fields[1], right: 30})
        );
        const exporter = glacier.createSvgExporter(model);

        await carSource.updateCache();
        await djiSource.updateCache();
        await baseline_internal("8-MPGOver30vDJI", (await exporter.export()).svg, "skip");
        await carSource.remove();
        await djiSource.remove();
    });


    it("should be able to filter data from a single data source", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative", scale: { domain: [0, 2000] } }),
            glacier.createSetFilterAction({type: "LT", left: addFields.payload.fields[1], right: 2000})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("9-FilteredData", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to apply AND filters", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "ProductNumber", table: "Product", dataSource: adapter.id }]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative", scale: { domain: [0, 2000] } }),
            glacier.createSetFilterAction({type: "AND", left: {type: "LT", left: addFields.payload.fields[1], right: 2000}, right: {type: "LIKE", left: addFields.payload.fields[2], right: "BK-%"}})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("10-ORFilter", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to apply OR filters", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "ProductNumber", table: "Product", dataSource: adapter.id }]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative" }),
            glacier.createSetFilterAction({type: "OR", left: {type: "LIKE", left: addFields.payload.fields[2], right: "FR-%"}, right: {type: "LIKE", left: addFields.payload.fields[2], right: "BK-%"}})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("11-ANDFilter", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to apply NE filters", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Color", table: "Product", dataSource: adapter.id }]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative" }),
            glacier.createAddChannelAction("color", { field: addFields.payload.fields[2].id, type: "nominal", legend: { title: "Product Color" } }),
            glacier.createSetFilterAction({type: "NE", left: addFields.payload.fields[2], right: "Black"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("12-NEFilter", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to apply EQ filters", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([{ name: "DaysToManufacture", table: "Product", dataSource: adapter.id }, { name: "ListPrice", table: "Product", dataSource: adapter.id }, { name: "Color", table: "Product", dataSource: adapter.id }]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative" }),
            glacier.createAddChannelAction("color", { field: addFields.payload.fields[2].id, type: "nominal" }),
            glacier.createSetFilterAction({type: "EQ", left: addFields.payload.fields[2], right: "Black"})
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("13-EQFilter", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    it("should be able to apply GTE and LTE filters", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        const addFields = glacier.createAddFieldsAction([
            { name: "DaysToManufacture", table: "Product", dataSource: adapter.id },
            { name: "ListPrice", table: "Product", dataSource: adapter.id }
        ]);
        dispatchSequence(model,
            addFields,
            glacier.createUpdateMarkTypeAction("point"),
            glacier.createUpdateDescriptionAction("Test Plot"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: addFields.payload.fields[0].id, type: "quantitative" }),
            glacier.createAddChannelAction("y", { field: addFields.payload.fields[1].id, type: "quantitative", scale: { domain: [500, 1500] } }),
            glacier.createSetFilterAction({
                type: "AND",
                left: {
                    type: "GTE",
                    left: addFields.payload.fields[1],
                    right: 500
                },
                right: {
                    type: "LTE",
                    left: addFields.payload.fields[1],
                    right: 1500
                }
            })
        );
        const exporter = glacier.createSvgExporter(model);

        await adapter.updateCache();
        await baseline_internal("14-GTELTEFilter", (await exporter.export()).svg, "skip");
        await adapter.remove();
    });

    baseline("should enable consumers to load data from CSV",
        "15-DJI",
        (model) => [glacier.createCSVDataSource(model(), fs.readFileSync(root`./data/dji.csv`).toString())],
        (source) => [
            { name: "Date", dataSource: source(0) }, { name: "High", dataSource: source(0) }
        ],
        (field) => [
            glacier.createUpdateMarkTypeAction("line"),
            glacier.createUpdateDescriptionAction("DJI v Time"),
            glacier.createUpdateSizeAction(255, 264),
            glacier.createAddChannelAction("x", { field: field(0), type: "temporal", axis: { title: "Date" } }),
            glacier.createAddChannelAction("y", { field: field(1), type: "quantitative", axis: { title: "Dow Jones Indstrial Average" }, scale: { type: "log" } })
        ]
    );

    baseline("should enable consumers to load data from JSON",
        "16-MPG",
        (model) => [glacier.createJSONDataSource(model(), fs.readFileSync(root`./data/cars.json`).toString())],
        (source) => [
            { name: "Year", dataSource: source(0) }, { name: "Miles_per_Gallon", dataSource: source(0) }
        ],
        (field) => [
            glacier.createUpdateMarkTypeAction("area"),
            glacier.createUpdateDescriptionAction("MPG vs Time"),
            glacier.createUpdateSizeAction(135, 400),
            glacier.createAddChannelAction("x", { field: field(0), type: "temporal", axis: { title: "Year", values: [{year: 1970}, {year: 1980}] }, timeUnit: "year" }),
            glacier.createAddChannelAction("y", { field: field(1), type: "quantitative", axis: { title: "MPG" }, aggregate: "min" }),
            glacier.createAddChannelAction("y2", { field: field(1), type: "quantitative", aggregate: "max" })
        ]
    );

    it("should be able to add default fields to sql adapter", async () => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, root`./data/CycleChain.sqlite`);
        dispatchSequence(model);
        await adapter.defaultFieldSelection();
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);
    });

    it("should be able to add default fields to memory data source", async () => {
        let model = glacier.createModel();
        const carSource = glacier.createMemoryDataSource(model);
        carSource(require(root`./data/cars.json`));
        dispatchSequence(model);
        await carSource.defaultFieldSelection();
        let state = model.getState();
        expect(Object.keys(state.fields).length).to.equal(2);
    });

    it("should be able to handle calls to export before fields are added", async () => {
        const model = glacier.createModel();
        glacier.createMemoryDataSource(model)(require(root`./data/cars.json`));
        const e = glacier.createSvgExporter(model);
        const r1 = await e.export();
        expect(r1).to.exist;
        model.dispatch(glacier.createUpdateSizeAction(200, 200));
        const r2 = await e.export();
        expect(r2).to.exist;
        expect(r2.spec.height).to.equal(200);
    });
});
