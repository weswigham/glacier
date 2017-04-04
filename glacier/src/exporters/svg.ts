import * as vl from "vega-lite";
import * as vega from "vega";
import redux = require("redux");
import {
    ModelState,
} from "../";
import {compileState} from "../mapper";
import {Exporter} from "./";


export function createSvgExporter(store: redux.Store<ModelState>) {
    const updater = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<{svg: string, spec: any}>);
    updater.export = async () => {
        return await new Promise<{svg: string, spec: any}>((resolve, reject) => {
            const {spec: compiled} = vl.compile(compileState(store.getState()));
            vega.parse.spec(compiled, chart => {
                let result: string | undefined;
                try {
                    result = chart({renderer: "svg"}).update().svg();
                }
                catch (e) {
                    return reject(e);
                }
                resolve({svg: result, spec});
            });
        });
    };
    store.subscribe(updater);
    return updater;
}
