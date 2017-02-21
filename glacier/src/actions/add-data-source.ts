import {ReduxStandardAction} from "./";

export type AddDataSourceAction<S extends string, T, C> = ReduxStandardAction<"ADD_DATA_SOURCE", {type: S, metadata: T, cache: C, id: number}>;
export type AddSqliteFileDataSourceAction<S> = AddDataSourceAction<"sqlite-file", {path: string}, S>;
export type AddMemoryDataSourceAction<S> = AddDataSourceAction<"memory", {}, S>;

let id = 0;

export function createAddDataSourceAction<C>(type: "sqlite-file", metadata: {path: string}, cache: C): AddSqliteFileDataSourceAction<C>;
export function createAddDataSourceAction<C>(type: "memory", metadata: {}, cache: C): AddMemoryDataSourceAction<C>;
export function createAddDataSourceAction<S extends string, M, C>(type: S, metadata: M, cache: C): AddDataSourceAction<S, M, C>;
export function createAddDataSourceAction<S extends string, M, C>(type: S, metadata: M, cache: C): AddDataSourceAction<S, M, C> {
    return { type: "ADD_DATA_SOURCE", payload: { type, metadata, cache, id: id++ } };
}