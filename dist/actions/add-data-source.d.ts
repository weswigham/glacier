import { ReduxStandardAction } from "./";
import { DataSourceId } from "../model";
import { DataAdapter, SqlDataSourceAdapter, MemoryDataSourceAdapter } from "../adapters";
export declare type AddDataSourceAction<S extends string, T, C> = ReduxStandardAction<"ADD_DATA_SOURCE", {
    type: S;
    metadata: T;
    cache: C;
    id: DataSourceId;
    adapter: DataAdapter;
}>;
export declare type AddSqliteFileDataSourceAction<S> = AddDataSourceAction<"sqlite-file", {
    path: string;
}, S>;
export declare type AddMemoryDataSourceAction<S> = AddDataSourceAction<"memory", {}, S>;
export declare function createAddDataSourceAction<C, S>(type: "sqlite-file", metadata: {
    path: string;
}, cache: C, adapter: SqlDataSourceAdapter<S>): AddSqliteFileDataSourceAction<C>;
export declare function createAddDataSourceAction<C>(type: "memory", metadata: {}, cache: C, adapter: MemoryDataSourceAdapter): AddMemoryDataSourceAction<C>;
export declare function createAddDataSourceAction<S extends string, M, C>(type: S, metadata: M, cache: C, adapter: DataAdapter): AddDataSourceAction<S, M, C>;
