import { DataAdapter } from "../adapters";
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
export declare type DataSourceId = number & DataSourceIdBrand;
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
        readonly width: number;
        readonly height: number;
    };
    readonly description?: string;
}
export declare type DeepReadonly<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
};
export declare type ChannelState = {
    readonly [K in Channel]?: DeepReadonly<ChannelArguments<K>>;
};
export interface FieldChannelDef extends BaseChannelDef {
    field: string | FieldId;
    type: "quantitative" | "temporal" | "ordinal" | "nominal" | "Q" | "T" | "O" | "N";
    aggregate?: "mean" | "sum" | "median" | "min" | "max" | "count";
    sort?: "ascending" | "descending" | "none";
    timeUnit?: string;
    bin?: boolean;
}
export interface ValueChannelDef extends BaseChannelDef {
    field: undefined;
    value: string | number;
}
export interface BaseChannelDef {
    scale?: ScaleDef;
    axis?: AxisDef | false;
    legend?: LegendDef | false;
}
export declare type ChannelDef = FieldChannelDef | ValueChannelDef;
export interface ScaleDef {
    type?: "linear" | "log" | "pow" | "sqrt" | "quantile" | "quantize" | "threshold" | "time" | "ordinal";
    domain?: [number, number] | number[] | [DateTimeDef, DateTimeDef];
    range?: string[] | string | [number, number] | number[];
    round?: boolean;
    clamp?: boolean;
    exponent?: number;
    nice?: boolean | string;
    zero?: boolean;
    useRawDomain?: boolean;
    bandSize?: number | "fit";
    padding?: number;
}
export interface DateTimeDef {
    year?: number;
    quarter?: 1 | 2 | 3 | 4;
    month?: string | number;
    date?: number;
    day?: number | string;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
export interface AxisDef {
    axisColor?: string;
    axisWidth?: number;
    layer?: "front" | "back";
    offset?: number;
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
    labelColor?: string;
    labelFont?: string;
    labelFontSize?: number;
    shortTimeLabels?: boolean;
    symbolColor?: string;
    symbolShape?: string;
    symbolSize?: number;
    symbolStrokeWidth?: number;
    title?: string;
    titleColor?: string;
    titleFont?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
}
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
}
export declare type Channel = keyof Encoding;
export declare type ChannelArguments<T extends Channel> = Encoding[T];
export interface Field {
    readonly name: string;
    readonly table?: string;
    readonly dataSource: DataSourceId;
}
export interface FieldIdBrand {
    " do not use field ": void;
}
export declare type FieldId = number & FieldIdBrand;
export declare type FieldDescriptor = Field & {
    id: FieldId;
};
export interface FieldState {
    [id: number]: FieldDescriptor;
}
export interface JoinDescriptor {
    readonly left: FieldId;
    readonly right: FieldId;
}
export interface TransformsState {
    readonly joins: JoinDescriptor[];
    readonly post_filter: FilterDescriptor | undefined;
}
export interface NumericConstantSelector {
    readonly type: "constant";
    readonly kind: "number";
    readonly value: number;
}
export interface StringConstantSelector {
    readonly type: "constant";
    readonly kind: "string";
    readonly value: string;
}
export declare type ConstantSelector = NumericConstantSelector | StringConstantSelector;
export interface FieldSelector {
    readonly type: "fieldref";
    readonly field: FieldId;
}
export declare type ValueSelector = ConstantSelector | FieldSelector;
export declare type NestedDescriptor = FilterDescriptor | ValueSelector;
export declare const BinaryFilters: {
    AND: "AND";
    OR: "OR";
    GT: "GT";
    GTE: "GTE";
    LT: "LT";
    LTE: "LTE";
    EQ: "EQ";
    NE: "NE";
    LIKE: "LIKE";
};
export declare type BinaryFilterDescriptors = {
    [K in keyof typeof BinaryFilters]: {
        readonly type: K;
        readonly left: NestedDescriptor;
        readonly right: NestedDescriptor;
    };
};
export declare type FilterDescriptor = BinaryFilterDescriptors["AND"] | BinaryFilterDescriptors["OR"] | BinaryFilterDescriptors["GT"] | BinaryFilterDescriptors["GTE"] | BinaryFilterDescriptors["LT"] | BinaryFilterDescriptors["LTE"] | BinaryFilterDescriptors["EQ"] | BinaryFilterDescriptors["NE"] | BinaryFilterDescriptors["LIKE"];
export declare type ValueSelectorArg = number | string | FieldDescriptor;
export declare type NestedDescriptorArg = FilterDescriptorArg | ValueSelectorArg;
export declare type BinaryFilterDescriptorsArg = {
    [K in keyof typeof BinaryFilters]: {
        readonly type: K;
        readonly left: NestedDescriptorArg;
        readonly right: NestedDescriptorArg;
    };
};
export declare type FilterDescriptorArg = BinaryFilterDescriptorsArg["AND"] | BinaryFilterDescriptorsArg["OR"] | BinaryFilterDescriptorsArg["GT"] | BinaryFilterDescriptorsArg["GTE"] | BinaryFilterDescriptorsArg["LT"] | BinaryFilterDescriptorsArg["LTE"] | BinaryFilterDescriptorsArg["EQ"] | BinaryFilterDescriptorsArg["NE"] | BinaryFilterDescriptorsArg["LIKE"];
export interface MemoryDataSource extends DataSource<"memory", {}, any> {
}
export interface SqliteFileDataSource extends DataSource<"sqlite-file", {
    path: string;
}, any> {
}
export declare type AnyDataSource = MemoryDataSource | SqliteFileDataSource | DataSource<string, {}, {}>;
