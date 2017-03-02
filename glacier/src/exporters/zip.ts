import redux = require("redux");
import JSZip = require("jszip");
import {ModelState} from "../";
import {Exporter, createSvgExporter} from "./";

export function createZipExporter(store: redux.Store<ModelState>, libary: {[idex: string]: Buffer}) {
    const updater = ((() => {
        // On update...
        // store.getState
    }) as Exporter<Uint8Array>);
    updater.export = async () => {
        const stateString = JSON.stringify(store.getState());
        const svgExporter = createSvgExporter(store);
        const zip = new JSZip();
        zip.file("state.json", stateString);
        zip.file("thumnail.svg", await svgExporter.export());
        const keys = Object.keys(libary);
        for ( const key of keys ) {
            zip.file(key, libary[key]);
        }
        return await zip.generateAsync({ type: "nodebuffer" });
    };
    store.subscribe(updater);
    return updater;
}