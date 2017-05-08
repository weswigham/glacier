import redux = require("redux");
import { DataAdapter } from "./";
export interface JSONDataSourceAdapter extends DataAdapter {
}
export declare function createJSONDataSource(store: redux.Store<{}>, content: string): JSONDataSourceAdapter;
