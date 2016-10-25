export interface ModelState {
    readonly sources: SourcesModelState;
}

export interface SourcesModelState {
    readonly [index: number]: AnyDataSource;
}

export interface DataSource<T extends string, M, C> {
    readonly type: T;
    readonly metadata: M;
    readonly cache: C;
    readonly uuid: number;
}

export interface MemoryDataSource extends DataSource<"memory", {}, any> {}
export interface SqliteFileDataSource extends DataSource<"sqlite-file", {path: string}, any> {}

export type AnyDataSource = MemoryDataSource | SqliteFileDataSource | DataSource<string, {}, {}>;