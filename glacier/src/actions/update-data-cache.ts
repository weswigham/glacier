import {ReduxStandardAction} from "./";

export type UpdateDataCacheAction<C> = ReduxStandardAction<"UPDATE_DATA_CACHE", {uuid: number, cache: C}>;

export function createUpdateDataCacheAction<C>(uuid: number, cache: C): UpdateDataCacheAction<C> {
    return {type: "UPDATE_DATA_CACHE", payload: {uuid, cache}};
}