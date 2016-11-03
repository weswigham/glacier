export type ReduxStandardAction<T extends string, P> = {type: T, payload: P, error?: Error};

export * from "./add-data-source";
export * from "./remove-data-source";
export * from "./update-data-cache";
// export * from "./configure-chart";
// export * from "./add-configuration";

import {AddDataSourceAction} from "./add-data-source";
import {RemoveDataSourceAction} from "./remove-data-source";
import {UpdateDataCacheAction} from "./update-data-cache";
// import {UpdateConfigurationAction} from "./configure-chart";
// import {AddConfigurationAction} from "./add-configuration";

// export type AllActions = AddDataSourceAction<string, {}, {}> | RemoveDataSourceAction | UpdateDataCacheAction<{}> | UpdateConfigurationAction<{}> | AddConfigurationAction;
export type AllActions = AddDataSourceAction<string, {}, {}> | RemoveDataSourceAction | UpdateDataCacheAction<{}>;