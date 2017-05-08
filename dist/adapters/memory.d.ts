import redux = require("redux");
import { DataAdapter } from "./";
export interface MemoryDataSourceAdapter extends DataAdapter {
    (data: any): void;
}
export declare function createMemoryDataSource(store: redux.Store<{}>): MemoryDataSourceAdapter;
