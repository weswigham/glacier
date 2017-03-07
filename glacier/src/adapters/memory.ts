import redux = require("redux");
import { ModelState, Field } from "../";
import { DataAdapter } from "./";
import { createAddDataSourceAction, createUpdateDataCacheAction, createRemoveDataSourceAction, createAddFieldsAction } from "../actions";

export interface MemoryDataSourceAdapter extends DataAdapter {
    (data: any): void;
}

export function createMemoryDataSource(store: redux.Store<ModelState>): MemoryDataSourceAdapter {
    let storedData: any[] = [];
    const func = (((data: any[]) => {
        storedData = data;
    }) as MemoryDataSourceAdapter);
    const createAction = createAddDataSourceAction("memory", {}, {}, func);
    const id = createAction.payload.id;
    func.defaultFieldSelection = async (selectNumnber = 2) => {
        if (storedData.length < 1) throw new Error("Cannot select fields with a data source that has 0 tables");

        const table = storedData[0]
        let keys = Object.keys(table)
        if (selectNumnber >= keys.length) throw new Error("Default columns cannot exceed the number of columns in the data source.");
        keys = keys.slice(0, selectNumnber);

        const fields: Field[] = keys.map(column => {
            return { name: column, table: table, dataSource: this.id };
        });
        const addAction = createAddFieldsAction(fields);
        this.store.dispatch(addAction);
    };
    func.updateCache = () => {
        const action = createUpdateDataCacheAction(id, storedData);
        store.dispatch(action);
        return Promise.resolve();
    };
    func.remove = () => {
        const action = createRemoveDataSourceAction(id);
        store.dispatch(action);
        return Promise.resolve();
    };
    func.id = id;
    store.dispatch(createAction);
    return func;
}