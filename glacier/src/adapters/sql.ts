import knex = require("knex");
import redux = require("redux");
import {ModelState} from "../";
import {DataAdapter} from "./";
import {createAddDataSourceAction, createUpdateDataCacheAction, createRemoveDataSourceAction} from "../actions";


const dummy = (true as boolean as false) || knex({}); // Makes the return type of the function available for reference without calling it
class SqlDataSourceAdapter implements DataAdapter {
    private _conn: typeof dummy;
    private _uuid: number;
    constructor(private store: redux.Store<ModelState>, filename: string) {
        const action = createAddDataSourceAction("sqlite-file", {path: filename}, {});
        this._uuid = action.payload.uuid;
        const connection = knex({
            client: "sqlite3",
            connection: { filename },
            useNullAsDefault: true
        });
        this._conn = connection;
        store.dispatch(action);
        this.updateCache();
    }
    updateCache() {
        this._conn.select("DaysToManufacture", "ListPrice").from("Product").then(data => {
            const action = createUpdateDataCacheAction(this._uuid, data);
            this.store.dispatch(action);
        }, err => {
            this.store.dispatch({type: "UPDATE_DATA_CACHE", error: err});
        });
    }
    remove() {

        const action = createRemoveDataSourceAction(this._uuid);
        this.store.dispatch(action);
    }
}

export function createSqlFileDataSource(store: redux.Store<ModelState>, filename:string) {
    return new SqlDataSourceAdapter(store, filename);
}