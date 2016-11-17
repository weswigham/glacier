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
        const exporter = glacier.createSvgExporter(model);
        // TODO: Update this example to appropriately insert encodings once encodings are held within the store
        const unsubscribe = model.subscribe(() => exporter.export().then(value => {
            expect(value).to.be.a("string");
            expect(value).to.be.equal(require("fs").readFileSync("../data/visualization.svg").toString());
            unsubscribe();
            adapter.remove();
            done();
        }).catch(err => done(err)));
        adapter.updateCache();
    });

    it("should be able to configure the description of the visualization", (done: (err?: any) => void) => {
        let model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        model.dispatch(glacier.createUpdateDescriptionAction('Test Line chart'));
        const exporter = glacier.createSvgExporter(model);
        // TODO: Update this example to appropriately insert encodings once encodings are held within the store
        const unsubscribe = model.subscribe(() => exporter.export().then(value => {
            expect(value).to.be.a("string");
            expect(value).to.be.equal(require("fs").readFileSync("../data/visualization.svg").toString());
            unsubscribe();
            adapter.remove();
            done();
        }).catch(err => done(err)));
        adapter.updateCache();
    });
});