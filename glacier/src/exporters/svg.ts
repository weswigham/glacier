import * as vl from "vega-lite";
declare global {
    interface Element {}
}
import * as vega from "vega";
import redux = require("redux");
import {ModelState} from "../";
import {Exporter} from "./";

export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater: Exporter<string> = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<string>);
    updater.export = () => {
        const {sources} = store.getState();
        // TODO: Store encodings in store; join multiple data sources in values
        const spec = {
            description:"Test Plot",
            data:{
                values: sources[0].cache
            },
            mark: "point",
            encoding:{
                x: {field: "DaysToManufacture", type: "quantitative"},
                y: {field: "ListPrice", type: "quantitative"}
            }
        };
        return new Promise<string>((resolve, reject) => {
            const {spec: compiled} = vl.compile(spec);
            vega.parse.spec(compiled, chart => {
                let result: string | undefined;
                try {
                    result = chart({renderer: "svg"}).update().svg();
                }
                catch (e) {
                    return reject(e);
                }
                resolve(result);
            });
        });
    };
    store.subscribe(updater);
    return updater;
}