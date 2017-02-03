import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type RemoveFieldAction = ReduxStandardAction<"REMOVE_FIELD", Field[]>;

export function createRemoveFieldAction(fields: Field[]): RemoveFieldAction {
    return {type: "REMOVE_FIELD", payload: fields};
}