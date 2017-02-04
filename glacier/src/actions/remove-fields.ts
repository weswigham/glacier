import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type RemoveFieldsAction = ReduxStandardAction<"REMOVE_FIELDS", Field[]>;

export function createRemoveFieldsAction(fields: Field[]): RemoveFieldsAction {
    return {type: "REMOVE_FIELDS", payload: fields};
}