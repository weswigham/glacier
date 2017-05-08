import redux = require("redux");
import { ModelState } from "../";
import { Exporter } from "./";
export declare type SVGExporter = Exporter<{
    svg: string;
    spec: any;
}>;
export declare function createSvgExporter(store: redux.Store<ModelState>, onChange?: (exp: SVGExporter) => void): SVGExporter;
export declare function createSvgExporter<T>(store: redux.Store<T>, select: (state: T) => ModelState, onChange?: (exp: SVGExporter) => void): SVGExporter;
