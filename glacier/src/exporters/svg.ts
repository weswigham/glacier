import * as vl from "vega-lite";
declare global {
    interface Element {}
}
import * as vega from "vega";
import redux = require("redux");
import {ModelState, MarkState} from "../";
import {Exporter} from "./";

export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<string>);
    updater.export = () => {
        const {sources, marks, fields} = store.getState();
        const spec: MarkState & {data?: any} = Object.create(marks);
        spec.data = {
            // For now (pre-synthetic data sources), assume all data can be found in the cache for the first 
            values: fields.map(f => sources[f.dataSource].cache)[0]
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