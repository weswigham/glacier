import {DataAdapter} from "../adapters";

export interface ModelState {
    readonly sources: SourcesModelState;
    readonly marks: MarkState;
    readonly fields: FieldState;
    readonly transforms: TransformsState;
    readonly channels: ChannelState;
}

export interface SourcesModelState {
    readonly [index: number]: AnyDataSource;
}

export interface DataSourceIdBrand {
    " do not use data source ": void;
}
export type DataSourceId = number & DataSourceIdBrand;
export interface DataSource<T extends string, M, C> {
    readonly type: T;
    readonly metadata: M;
    readonly cache: C;
    readonly id: DataSourceId;
    readonly adapter: DataAdapter;
}

export interface MarkState {
    readonly mark?: string;
    readonly size?: {
        readonly width: number,
        readonly height: number
    };
    readonly description?: string;
}

export type DeepReadonly<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
}

export type ChannelState = {
    readonly [K in Channel]?: DeepReadonly<ChannelArguments<K>>;
}

export interface FieldChannelDef extends BaseChannelDef {
    // String identifying field of channel
    field: string | FieldId; // FieldId is a local addition. Subtraction types would make it easier to type this correctly
    // Type of channel
    type: "quantitative" | "temporal" | "ordinal" | "nominal" | "Q" | "T" | "O" | "N";
    // Aggregation to perform of the field, if desired
    aggregate?: "mean" | "sum" | "median" | "min" | "max" | "count";
    // If the field needs to be sorted, how it should be sorted
    sort?: "ascending" | "descending" | "none";
    // If the field is temporal, what granularity of time units to show, eg "year" or "yearmonth"
    timeUnit?: string; // Way too many options to enumerate here
    // If the field should be binned
    bin?: boolean;
}

export interface ValueChannelDef extends BaseChannelDef {
    // Used for specifying constant values rather than fields, mutually exclusive with field + type
    field?: undefined; // This should make this discernable from field channels defs
    value: string | number; // Mutually exclusive with field
}

export interface BaseChannelDef {
    scale?: ScaleDef;
    axis?: AxisDef | false;
    legend?: LegendDef | false;
}

export type ChannelDef = FieldChannelDef | ValueChannelDef;

// TODO: ScaleDef is dependent on field type, and different definitions should exist for each type
export interface ScaleDef {
    type?: "linear" | "log" | "pow" | "sqrt" | "quantile" | "quantize" | "threshold" | "time" | "ordinal";
    domain?: [number, number] | number[] | [DateTimeDef, DateTimeDef];
    range?: string[] | string | [number, number] | number[];
    round?: boolean;

    // quantitative only
    clamp?: boolean; // Also time
    exponent?: number;
    nice?: boolean | string; // bool for quant, string for time
    zero?: boolean;
    useRawDomain?: boolean;

    // ordinal only
    bandSize?: number | "fit";
    padding?: number;
}

export interface DateTimeDef {
    year?: number;
    quarter?: 1 | 2 | 3 | 4;
    month?: string | number;
    date?: number; // TODO: could use literal types 1-31
    day?: number | string; // TODO: could use literal numbers 1-7
    hours?: number; // TODO: could use literal number 0-23
    minutes?: number; // TODO: could use literal types 0-59
    seconds?: number; // TODO: could use literal types 0-59
    milliseconds?: number; // TODO: could use literal type 0-999
}

export interface AxisDef {
    axisColor?: string;
    axisWidth?: number;
    layer?: "front" | "back";
    offset?: number;
    // Dependent on being in the row or column channels
    orient?: "top" | "bottom" | "left" | "right";
    grid?: boolean;
    gridColor?: string;
    gridDash?: number[];
    gridOpacity?: number;
    gridWidth?: number;
    labels?: boolean;
    format?: string;
    labelAngle?: number;
    labelMaxLength?: number;
    shortTimeLabels?: boolean;
    subdivide?: number;
    ticks?: number;
    tickColor?: string;
    tickLabelColor?: string;
    tickLabelFont?: string;
    tickLabelFontSize?: number;
    tickPadding?: number;
    tickSize?: number;
    tickSizeMajor?: number;
    tickSizeMinor?: number;
    tickSizeEnd?: number;
    tickWidth?: number;
    values?: number[] | DateTimeDef[];
    title?: string;
    titleColor?: string;
    titleFont?: string;
    titleFontWeight?: number;
    titleFontSize?: number;
    titleOffset?: number;
    titleMaxLength?: number;
    characterWidth?: number;
}

export interface LegendDef {
    orient?: "left" | "right";
    offset?: number;
    values?: DateTimeDef[] | string[] | number[];
    format?: string;
    labelAlign?: string;
    labelBaseline?: string;
    labelCOlor?: string;
    labelFont?: string;
    labelFontSize?: number;
    shortTimeLabels: boolean;
    symbolColor?: string;
    symbolShape?: string;
    symbolSize?: number;
    symbolStrokeWidth?: number;
    title?: string;
    titleColor?: string;
    titleFont?: string;
    titleFontSize?: string;
    titleFontWeight: string;
}

// TODO: Pull detailed Encoding type from latest vega-lite dts
export interface Encoding {
    x?: ChannelDef;
    y?: ChannelDef;
    x2?: ChannelDef;
    y2?: ChannelDef;
    color?: ChannelDef;
    opacity?: ChannelDef;
    size?: ChannelDef;
    shape?: ChannelDef;
    detail?: ChannelDef;
    text?: ChannelDef;
    path?: ChannelDef;
    order?: ChannelDef;
    row?: ChannelDef;
    column?: ChannelDef;
};

export type Channel = keyof Encoding;
export type ChannelArguments<T extends Channel> = Encoding[T];

export interface Field {
    readonly name: string;
    // TODO: Remove `table` and make data sources be inherently only one table at a time.
    readonly table?: string;
    readonly dataSource: DataSourceId;
}

export interface FieldIdBrand {
    " do not use field ": void;
}
export type FieldId = number & FieldIdBrand;
export type FieldDescriptor = Field & { id: FieldId; }

export interface FieldState {
    [id: number]: FieldDescriptor;
}

export interface JoinDescriptor {
    readonly left: FieldId;
    readonly right: FieldId;
}

export interface TransformsState {
    readonly joins: JoinDescriptor[];
}

export interface MemoryDataSource extends DataSource<"memory", {}, any> {}
export interface SqliteFileDataSource extends DataSource<"sqlite-file", {path: string}, any> {}

export type AnyDataSource = MemoryDataSource | SqliteFileDataSource | DataSource<string, {}, {}>;
