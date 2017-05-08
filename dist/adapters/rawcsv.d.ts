import redux = require("redux");
import { DataAdapter } from "./";
export interface CSVDataSourceAdapter extends DataAdapter {
}
export declare function createCSVDataSource(store: redux.Store<{}>, content: string): CSVDataSourceAdapter;
