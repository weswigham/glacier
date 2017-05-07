import { ModelState, ChannelState } from "../";
export declare function compileState({sources, marks, fields: fieldTable, transforms, channels}: ModelState): {
    readonly mark?: string | undefined;
    readonly size?: {
        readonly width: number;
        readonly height: number;
    } | undefined;
    readonly description?: string | undefined;
    data: {
        values: any;
    };
    encoding: ChannelState;
};
