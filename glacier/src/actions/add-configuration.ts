import {ReduxStandardAction} from "./";

let uuid = 0;

export type AddConfigurationAction = ReduxStandardAction<"ADD_CONFIGURATION", {uuid: number}>;

export function createAddConfiguration(uuid : number): AddConfigurationAction {
    return { type: "ADD_CONFIGURATION", payload: {uuid:uuid++}};
}