/// <reference types="node" />
import redux = require("redux");
import { ModelState } from "../";
import { Exporter } from "./";
export declare function createZipExporter(store: redux.Store<ModelState>, libary: {
    [idex: string]: Buffer;
}): Exporter<Uint8Array>;
