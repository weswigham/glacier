import redux = require("redux");
import { ModelState } from "../";
import { DataAdapter } from "./";
export interface JSONDataSourceAdapter extends DataAdapter {
}
export declare function createJSONDataSource(store: redux.Store<ModelState>, content: string): JSONDataSourceAdapter;
