import redux = require("redux");
import { ModelState } from "../";
import { Exporter } from "./";
export declare function createSvgExporter(store: redux.Store<ModelState>): Exporter<{
    svg: string;
    spec: any;
}>;
