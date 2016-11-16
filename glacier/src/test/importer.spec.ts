/// <reference types="mocha" />
import {expect} from "chai";
import * as glacier from "../index";
import {parseString}  from 'xml2js';



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
        const model = glacier.createModel();
        const adapter = glacier.createSqlFileDataSource(model, "../data/CycleChain.sqlite");
        const exporter = glacier.createSvgExporter(model);
        // TODO: Update this example to appropriately insert encodings once encodings are held within the store
        adapter.updateCache().then(() => exporter.export().then(value => {
            expect(value).to.be.a("string");
        //    expect(value).to.be.equal(require("fs").readFileSync("../data/visualization.svg").toString());
            const xml = require("fs").readFileSync("../data/visualization.svg").toString();
            let tOne = new Array();
            let tTwo = new Array();
            let firstEles = new Array();
            let secondEles = new Array();
            const recurse = function(xmljs:any){
                let eles = 0;
                let gElements = 0;
                if ( xmljs instanceof Object) {
                    const keys = Object.keys(xmljs);
                    eles += keys.length;
                    for (var i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        if (key == "g"){
                            ++gElements;
                        }
                        if(key=="DaysToManufacture"){
                            console.log(xmljs[key]);
                        }
                        let resp = recurse(xmljs[key]);
                        eles += resp[0];
                        gElements += resp[1];
                        
                    }
                }
                if ( xmljs instanceof Array ) {
                    for (var i = 0; i < xmljs.length; i++) {
                      // console.log(xmljs);
                        let resp = recurse(xmljs[i]);
                        eles += resp[0];
                        gElements += resp[1];
                    }
                }
                
                let response = [eles, gElements];
                return response;
            }
            
            parseString(xml, function(err, result){
                tOne = recurse(result);
                firstEles = Object.keys(result.svg);
            });
            parseString(value, function(err, result){
                tTwo = recurse(result);
                secondEles = Object.keys(result.svg);
            });
            
            expect(tOne[0]).to.be.equal(tTwo[0]);
            expect(tOne[1]).to.be.equal(tTwo[1]);
            //expect(firstEles).to.be.equal(secondEles);
            adapter.remove();
            done();
        }).catch(err => done(err)));
    });
});