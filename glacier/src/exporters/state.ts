import redux = require("redux");
import JSZip = require("jszip");
import {ModelState} from "../";
import {Exporter, createSvgExporter} from "./";

export function createStateExporter(store: redux.Store<ModelState>, uuid: number, libary: Buffer) {
    const updater: Exporter<any> = ((() => {
        // On update...
        // store.getState()
    }) as Exporter<any>);
    updater.export = () => {
        return new Promise<JSZip>((resolve, reject) => {
            let stateString = JSON.stringify(store.getState());
            const svgExporter = createSvgExporter(store, uuid);
            let zip = new JSZip();
            zip.file("state.json", stateString);
            zip.file("thumnail.svg", svgExporter.export());
            zip.file("glacier.js", libary);
            resolve(zip);
        });
    };
    store.subscribe(updater);
    return updater;
}