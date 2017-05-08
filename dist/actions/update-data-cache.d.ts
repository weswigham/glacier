import { ReduxStandardAction } from "./";
export declare type UpdateDataCacheAction<C> = ReduxStandardAction<"UPDATE_DATA_CACHE", {
    id: number;
    cache: C;
}>;
export declare function createUpdateDataCacheAction<C>(id: number, cache: C): UpdateDataCacheAction<C>;
