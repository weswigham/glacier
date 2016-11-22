import {ReduxStandardAction} from "./";

let uuid = 0;

export type AddMarkAction = ReduxStandardAction<"ADD_MARK", {uuid: number}>;

export function createAddConfigurationAction(): AddMarkAction {
    return { type: "ADD_MARK", payload: {uuid:uuid++}};
}