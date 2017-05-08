/// <reference types="node" />
import redux = require("redux");
import { ModelState } from "../";
import { Exporter } from "./";
export declare type ZipExporter = Exporter<Uint8Array>;
export declare function createZipExporter(store: redux.Store<ModelState>, library: {
    [index: string]: Buffer;
}, onChange?: (exp: ZipExporter) => void): ZipExporter;
export declare function createZipExporter<T>(store: redux.Store<T>, library: {
    [index: string]: Buffer;
}, select: (state: T) => ModelState, onChange?: (exp: ZipExporter) => void): ZipExporter;
