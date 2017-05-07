import redux = require("redux");
import { ModelState } from "../";
import { DataAdapter } from "./";
export interface MemoryDataSourceAdapter extends DataAdapter {
    (data: any): void;
}
export declare function createMemoryDataSource(store: redux.Store<ModelState>): MemoryDataSourceAdapter;
