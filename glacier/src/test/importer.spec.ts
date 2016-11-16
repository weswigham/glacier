/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";
import {parseString}  from 'xml2js';

function xml2json(xml: string) {
    return new Promise<any>((resolve, reject) => parseString(xml, (err, json) => err ? reject(err) : resolve(json)));
}

type SvgStats = {totalElements: number, gElements: number};
function visitStructureAndGatherStats(xmljs: {[index: string]: any}, visited: any[] = []): SvgStats {
    return Object.keys(xmljs).reduce<SvgStats>(({totalElements, gElements}, key) => {
        if (visited.indexOf(xmljs[key]) !== -1) return {totalElements, gElements}; // Must keep a visited list, as xml structure can contains parent references
        visited.push(xmljs[key]);
        const {totalElements: elems, gElements: gs} = visitStructureAndGatherStats(xmljs[key], visited);
        return {totalElements: totalElements+elems+1, gElements: gElements+gs+(key === "g" ? 1 : 0)};
    }, {totalElements: 0, gElements: 0});
};

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
            
            return Promise.all([xml2json(xml), xml2json(value)]).then(([result1, result2]) => {
                const [tOne, tTwo] = [visitStructureAndGatherStats(result1), visitStructureAndGatherStats(result2)];
                expect(tOne.totalElements).to.be.equal(tTwo.totalElements);
                expect(tOne.gElements).to.be.equal(tTwo.gElements);
                return adapter.remove();
            });
        });
    });
});