import {ReduxStandardAction} from "./";

export type RemoveDataSourceAction = ReduxStandardAction<"REMOVE_DATA_SOURCE", {uuid: number}>;

export function createRemoveDataSourceAction(uuid: number): RemoveDataSourceAction {
    return {type: "REMOVE_DATA_SOURCE", payload: {uuid}};
}