import {ReduxStandardAction} from "./";

export type RemoveDataSourceAction = ReduxStandardAction<"REMOVE_DATA_SOURCE", {id: number}>;

export function createRemoveDataSourceAction(id: number): RemoveDataSourceAction {
    return {type: "REMOVE_DATA_SOURCE", payload: {id}};
}