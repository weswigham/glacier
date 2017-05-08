import redux = require("redux");
import alasql = require("alasql");
import { DataAdapter } from "./";
import { createAddDataSourceAction } from "../actions";
import { SinglyLoadedMemoryDataSource } from "./single-memory-load-base";

export interface CSVDataSourceAdapter extends DataAdapter {}

export function createCSVDataSource(store: redux.Store<{}>, content: string): CSVDataSourceAdapter {
    const storedData = alasql(`SELECT * FROM CSV(?, {headers:true})`, [content]);
    const adapter: CSVDataSourceAdapter = new SinglyLoadedMemoryDataSource(storedData, store);
    const createAction = createAddDataSourceAction("rawcsv", {}, {}, adapter);
    adapter.id = createAction.payload.id;
    store.dispatch(createAction);
    return adapter;
}