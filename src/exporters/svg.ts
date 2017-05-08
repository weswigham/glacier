import * as vl from "vega-lite";
import * as vega from "vega";
import redux = require("redux");
import {
    ModelState,
} from "../";
import {compileState} from "../mapper";
import {Exporter} from "./";

export type SVGExporter = Exporter<{svg: string, spec: any}>;

export function createSvgExporter(
    store: redux.Store<ModelState>,
    onChange?: (exp: SVGExporter) => void
): SVGExporter;
export function createSvgExporter<T>(
    store: redux.Store<T>,
    select: (state: T) => ModelState,
    onChange?: (exp: SVGExporter) => void
): SVGExporter;
export function createSvgExporter<T>(
    store: redux.Store<T>,
    selectOrOnChange?: ((state: T) => ModelState) | ((exp: SVGExporter) => void),
    onChange?: (exp: SVGExporter) => void
): SVGExporter {
    let select = ((s: any) => s);
    if (onChange) {
        select = selectOrOnChange as (state: T) => ModelState;
    }
    else if (selectOrOnChange) {
        onChange = selectOrOnChange as (exp: SVGExporter) => void;
    }

    const updater = ((() => {
        if (onChange) {
            onChange(updater);
        }
    }) as SVGExporter);
    updater.export = async () => {
        return await new Promise<{svg: string, spec: any}>((resolve, reject) => {
            const spec = compileState(select(store.getState()));
            const {spec: compiled} = vl.compile(spec);
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
    updater.dispose = store.subscribe(updater);
    return updater;
}
