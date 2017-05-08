import { DataSourceId } from "../model";
export interface DataAdapter {
    updateCache(): Promise<any>;
    remove(): Promise<any>;
    defaultFieldSelection(selectNumber?: number): Promise<any>;
    id: DataSourceId;
}
export * from "./memory";
export * from "./sql";
export * from "./rawcsv";
export * from "./jsonblob";
