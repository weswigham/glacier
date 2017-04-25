import redux = require("redux");
import { ModelState } from "../";
import { DataAdapter } from "./";
import { createAddDataSourceAction } from "../actions";
import { SinglyLoadedMemoryDataSource } from "./single-memory-load-base";

export interface JSONDataSourceAdapter extends DataAdapter {}

export function createJSONDataSource(store: redux.Store<ModelState>, content: string): JSONDataSourceAdapter {
    const storedData = JSON.parse(content);
    const adapter: JSONDataSourceAdapter = new SinglyLoadedMemoryDataSource(storedData, store);
    const createAction = createAddDataSourceAction("jsonblob", {}, {}, adapter);
    adapter.id = createAction.payload.id;
    store.dispatch(createAction);
    return adapter;
}