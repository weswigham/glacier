export interface ModelState {
    readonly sources: SourcesModelState;
    readonly marks: MarkState;
    readonly fields: FieldState;
}

export interface SourcesModelState {
    readonly [index: number]: AnyDataSource;
}

export interface DataSource<T extends string, M, C> {
    readonly type: T;
    readonly metadata: M;
    readonly cache: C;
    readonly id: number;
}

export interface MarkState {
    readonly mark?: string;
    readonly size?: {
        readonly width: number,
        readonly height: number
    };
    readonly description?: string;
    readonly encoding?: Encoding;
}
export interface Encoding {
    readonly x?: {};
    readonly y?: {};
    readonly x2?: {};
    readonly y2?: {};
    readonly color?: {};
    readonly opacity?: {};
    readonly size?: {};
    readonly shape?: {};
    readonly detail?: {};
    readonly text?: {};
    readonly path?: {};
    readonly order?: {};
    readonly row?: {};
    readonly column?: {};
};

export interface Field {
    readonly name: string;
    readonly table: string;
    readonly dataSource: number;
}

export type FieldDescriptor = Field & { id: number; }

export type FieldState = FieldDescriptor[];

export interface MemoryDataSource extends DataSource<"memory", {}, any> {}
export interface SqliteFileDataSource extends DataSource<"sqlite-file", {path: string}, any> {}

export type AnyDataSource = MemoryDataSource | SqliteFileDataSource | DataSource<string, {}, {}>;