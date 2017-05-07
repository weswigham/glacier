import { ReduxStandardAction } from "./";
import { DataSourceId } from "../model";
export declare type RemoveDataSourceAction = ReduxStandardAction<"REMOVE_DATA_SOURCE", {
    id: DataSourceId;
}>;
export declare function createRemoveDataSourceAction(id: DataSourceId): RemoveDataSourceAction;
