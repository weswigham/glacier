import redux = require("redux");
import { ModelState, DataSourceId } from "../";
import { DataAdapter } from "./";
export declare class SqlDataSourceAdapter<T> implements DataAdapter {
    private store;
    private _selector;
    private _conn;
    id: DataSourceId;
    constructor(store: redux.Store<ModelState>, filename: string);
    constructor(store: redux.Store<T>, filename: string, _selector: (s: T) => ModelState);
    defaultFieldSelection(selectNumber?: number): Promise<void>;
    assertConnection(): void;
    describeTables(): Promise<string[]>;
    describeColumns(table: string): Promise<string[]>;
    updateCache(): Promise<void[]>;
    remove(): Promise<void>;
}
export declare function createSqlFileDataSource(store: redux.Store<ModelState>, filename: string): SqlDataSourceAdapter<{}>;
