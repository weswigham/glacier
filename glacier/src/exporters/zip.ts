import redux = require("redux");
import JSZip = require("jszip");
import {ModelState} from "../";
import {Exporter, createSvgExporter} from "./";

export function createZipExporter(store: redux.Store<ModelState>, id: number, libary: Buffer) {
    const updater = ((() => {
        // On update...
        // store.getState
    }) as Exporter<JSZip>);
    updater.export = async () => {
        const stateString = JSON.stringify(store.getState());
        const svgExporter = createSvgExporter(store, id);
        const zip = new JSZip();
        zip.file("state.json", stateString);
        zip.file("thumnail.svg", await svgExporter.export());
        zip.file("glacier.js", libary);
        return zip;
    };
    store.subscribe(updater);
    return updater;
}