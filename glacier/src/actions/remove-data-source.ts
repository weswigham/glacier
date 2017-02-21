import {ReduxStandardAction} from "./";
import {DataSourceId} from "../model";

export type RemoveDataSourceAction = ReduxStandardAction<"REMOVE_DATA_SOURCE", {id: DataSourceId}>;

export function createRemoveDataSourceAction(id: DataSourceId): RemoveDataSourceAction {
    return {type: "REMOVE_DATA_SOURCE", payload: {id}};
}