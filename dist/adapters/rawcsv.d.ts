import redux = require("redux");
import { ModelState } from "../";
import { DataAdapter } from "./";
export interface CSVDataSourceAdapter extends DataAdapter {
}
export declare function createCSVDataSource(store: redux.Store<ModelState>, content: string): CSVDataSourceAdapter;
