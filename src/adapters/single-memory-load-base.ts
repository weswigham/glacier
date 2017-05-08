import redux = require("redux");
import { Field, DataSourceId } from "../";
import { DataAdapter } from "./";
import { createUpdateDataCacheAction, createRemoveDataSourceAction, createAddFieldsAction } from "../actions";
import { poisonPill } from "../util";

export class SinglyLoadedMemoryDataSource implements DataAdapter {
    constructor(protected storedData: any[], protected store: redux.Store<{}>) {}
    async defaultFieldSelection(selectNumber = 2) {
        if (this.storedData.length < 1) throw new Error("Cannot select fields with a data source that has 0 tables");
        if (selectNumber === undefined) throw new Error("Field selection number cannot be null or undefined");
        const row = this.storedData[0];
        let keys = Object.keys(row);
        if (selectNumber >= keys.length) throw new Error("Default columns cannot exceed the number of columns in the data source.");
        keys = keys.slice(0, selectNumber);

        const fields: Field[] = keys.map(k => {
            return { name: k, dataSource: this.id };
        });
        const addAction = createAddFieldsAction(fields);
        this.store.dispatch(addAction);
    }
    updateCache() {
        const action = createUpdateDataCacheAction(this.id, this.storedData);
        this.store.dispatch(action);
        return Promise.resolve();
    }
    remove() {
        const action = createRemoveDataSourceAction(this.id);
        this.store.dispatch(action);
        this.updateCache = poisonPill("data source removed");
        this.defaultFieldSelection = poisonPill("data source removed");
        this.remove = poisonPill("data source removed");
        return Promise.resolve();
    }
    id = -1 as DataSourceId;
}