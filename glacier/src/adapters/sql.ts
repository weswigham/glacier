import knex = require("knex");
import redux = require("redux");
import {ModelState} from "../";
import {DataAdapter} from "./";
import {createAddDataSourceAction, createUpdateDataCacheAction, createRemoveDataSourceAction} from "../actions";


const dummy = (true as boolean as false) || knex({}); // Makes the return type of the function available for reference without calling it
export class SqlDataSourceAdapter implements DataAdapter {
    private _conn: typeof dummy;
    id: number;
    constructor(private store: redux.Store<ModelState>, filename: string) {
        const action = createAddDataSourceAction("sqlite-file", {path: filename}, {});
        this.id = action.payload.id;
        const connection = knex({
            client: "sqlite3",
            connection: { filename },
            useNullAsDefault: true
        });
        this._conn = connection;
        store.dispatch(action);
        this.updateCache();
    };
    describeTables() {
         return this._conn
            .select("name")
            .from("sqlite_master")
            .where("type", "table")
            .returning("name")
            .then((results: [{name: string}]) => {
                return results.map(table => {
                    return table.name;
                });
            });
    }
    describeColumns(table: string) {
        this._conn
        .raw("Pragma table_info(" + table + ")")
        .then((data: {"name": string}[]) => {
            let columns = data.map(column => {
                return column.name;
            })
            .filter(name => {
                return name != "rowguid";
            });
            return columns;
        });
    }
    updateCache() {
        let state = this.store.getState();
        let fields: {[index: string]: string[]} = state.fields.filter(item =>
             item.dataSource === this.id
        )
        .reduce((prev, curr, index) => {
            prev[curr.table] = prev[curr.table] || [];
            prev[curr.table].push(curr.name);
            return prev;
        }, {} as {[index: string]: string[]});

        return Promise.all(Object.keys(fields).map(key => {
            return this._conn.select(...fields[key]).from(key).then(data => {
            const action = createUpdateDataCacheAction(this.id, data);
            this.store.dispatch(action);
        }, err => {
            this.store.dispatch({type: "UPDATE_DATA_CACHE", error: err});
            });
        }));
    }
    remove() {
        const action = createRemoveDataSourceAction(this.id);
        this.store.dispatch(action);
        return Promise.resolve();
    }
}

export function createSqlFileDataSource(store: redux.Store<ModelState>, filename: string) {
    return new SqlDataSourceAdapter(store, filename);
}