import knex = require("knex");
import redux = require("redux");
import { ModelState, DataSourceId, Field } from "../";
import { DataAdapter } from "./";
import { createAddDataSourceAction, createUpdateDataCacheAction, createRemoveDataSourceAction, createAddFieldsAction } from "../actions";


const dummy = (true as boolean as false) || knex({}); // Makes the return type of the function available for reference without calling it
export class SqlDataSourceAdapter<T> implements DataAdapter {
    private _conn: typeof dummy;
    id: DataSourceId;

    constructor(store: redux.Store<ModelState>, filename: string)
    constructor(store: redux.Store<T>, filename: string, _selector: (s: T) => ModelState)
    constructor(private store: redux.Store<T>, filename: string, private _selector: (s: T) => ModelState = ((s: any) => s)) {
        const action = createAddDataSourceAction("sqlite-file", { path: filename }, {}, this);
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
    async defaultFieldSelection(selectNumber = 2) {
        this.assertConnection();
        const tables: string[] = await this.describeTables();
        if (tables.length < 1) throw new Error("Data source must have at least 1 table to select from.");
        const defaultTable = tables[0];
        let columns: string[] = await this.describeColumns(defaultTable);

        if (selectNumber >= columns.length) throw new Error("Default columns cannot exceed the number of columns in the data source.");
        columns = columns.slice(0, selectNumber);

        const fields: Field[] = columns.map(column => {
            return {name: column, table: defaultTable, dataSource: this.id};
        });
        const addAction = createAddFieldsAction(fields);
        this.store.dispatch(addAction);
    }
    assertConnection() {
        if (!this._conn) throw new Error("There is no connection - has the connection been closed?");
    }
    describeTables() {
        this.assertConnection();
        return this._conn
            .select("name")
            .from("sqlite_master")
            .where("type", "table")
            .returning("name")
            .then((results: [{ name: string }]) => {
                return results.map(table => {
                    return table.name;
                });
            });
    }
    describeColumns(table: string) {
        this.assertConnection();
        return this._conn
            .raw("Pragma table_info(" + table + ")")
            .then((data: { "name": string }[]) => {
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
        this.assertConnection();
        let state = this._selector(this.store.getState());
        let fields: { [index: string]: string[] } = Object.keys(state.fields).map(k => state.fields[+k]).filter(item =>
            item.dataSource === this.id
        )
        .reduce((prev, curr, index) => {
            if (!curr.table) return prev;
            prev[curr.table] = prev[curr.table] || [];
            prev[curr.table].push(curr.name);
            return prev;
        }, {} as { [index: string]: string[] });

        return Promise.all(Object.keys(fields).map(key => {
            this.assertConnection();
            return this._conn.select(...fields[key]).from(key).then(data => {
                const action = createUpdateDataCacheAction(this.id, data);
                this.store.dispatch(action);
            }, err => {
                this.store.dispatch({ type: "UPDATE_DATA_CACHE", error: err });
            });
        }));
    }
    remove() {
        const action = createRemoveDataSourceAction(this.id);
        this.store.dispatch(action);
        const conn = this._conn;
        delete this._conn;
        return conn.destroy();
    }
}

export function createSqlFileDataSource(store: redux.Store<ModelState>, filename: string) {
    return new SqlDataSourceAdapter(store, filename);
}