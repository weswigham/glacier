import redux = require("redux");
import { ModelState, DataSourceId } from "../";
import { DataAdapter } from "./";
export declare class SinglyLoadedMemoryDataSource implements DataAdapter {
    protected storedData: any[];
    protected store: redux.Store<ModelState>;
    constructor(storedData: any[], store: redux.Store<ModelState>);
    defaultFieldSelection(selectNumber?: number): Promise<void>;
    updateCache(): Promise<void>;
    remove(): Promise<void>;
    id: DataSourceId;
}
