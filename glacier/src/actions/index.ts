export type ReduxStandardAction<T extends string, P> = {type: T, payload: P, error?: Error};

export * from "./add-data-source";
export * from "./remove-data-source";
export * from "./update-data-cache";
export * from "./configure-mark";
export * from "./add-fields";
export * from "./remove-fields";

import {AddDataSourceAction} from "./add-data-source";
import {RemoveDataSourceAction} from "./remove-data-source";
import {UpdateDataCacheAction} from "./update-data-cache";
import {AddFieldsAction} from "./add-fields";
import {RemoveFieldsAction, RemoveFieldsByIdAction} from "./remove-fields";
import {UpdateDescriptionAction, UpdateEncodingAction, UpdateMarkTypeAction, UpdateSizeAction} from "./configure-mark";

export type AllActions = AddDataSourceAction<string, {}, {}>
    | RemoveDataSourceAction
    | UpdateDataCacheAction<{}>
    | UpdateDescriptionAction
    | UpdateEncodingAction
    | UpdateMarkTypeAction
    | UpdateSizeAction
    | AddFieldsAction
    | RemoveFieldsAction
    | RemoveFieldsByIdAction;