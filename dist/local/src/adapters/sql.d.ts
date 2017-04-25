import redux = require("redux");
import { ModelState, DataSourceId } from "../";
import { DataAdapter } from "./";
export declare class SqlDataSourceAdapter implements DataAdapter {
    private store;
    private _conn;
    id: DataSourceId;
    constructor(store: redux.Store<ModelState>, filename: string);
    defaultFieldSelection(selectNumber?: number): Promise<void>;
    assertConnection(): void;
    describeTables(): Promise<any>;
    describeColumns(table: string): Promise<any>;
    updateCache(): Promise<any[]>;
    remove(): Promise<void>;
}
export declare function createSqlFileDataSource(store: redux.Store<ModelState>, filename: string): SqlDataSourceAdapter;
