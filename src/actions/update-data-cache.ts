import {ReduxStandardAction} from "./";

export type UpdateDataCacheAction<C> = ReduxStandardAction<"UPDATE_DATA_CACHE", {id: number, cache: C}>;

export function createUpdateDataCacheAction<C>(id: number, cache: C): UpdateDataCacheAction<C> {
    return {type: "UPDATE_DATA_CACHE", payload: {id, cache}};
}