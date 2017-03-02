import {DataSourceId} from "../model";

export interface DataAdapter {
    updateCache(): Promise<any>;
    remove(): Promise<any>;
    id: DataSourceId;
}

export * from "./memory";
export * from "./sql";