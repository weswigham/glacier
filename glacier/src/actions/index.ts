export type ReduxStandardAction<T extends string, P> = {type: T, payload: P, error?: Error};

export * from "./add-data-source";
export * from "./remove-data-source";
export * from "./update-data-cache";
export * from "./configure-mark";
export * from "./add-field";
export * from "./remove-field";

import {AddDataSourceAction} from "./add-data-source";
import {RemoveDataSourceAction} from "./remove-data-source";
import {UpdateDataCacheAction} from "./update-data-cache";
import {AddFieldAction} from "./add-field";
import {RemoveFieldAction} from "./remove-field";
import {UpdateDescriptionAction, UpdateEncodingAction, UpdateMarkTypeAction, UpdateSizeAction} from "./configure-mark";

export type AllActions = AddDataSourceAction<string, {}, {}>
    | RemoveDataSourceAction
    | UpdateDataCacheAction<{}>
    | UpdateDescriptionAction
    | UpdateEncodingAction
    | UpdateMarkTypeAction
    | UpdateSizeAction
    | AddFieldAction
    | RemoveFieldAction;