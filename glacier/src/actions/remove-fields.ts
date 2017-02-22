import {ReduxStandardAction} from "./";
import {Field, FieldId} from "../model";

export type RemoveFieldsAction = ReduxStandardAction<"REMOVE_FIELDS", {fields: Field[]}>;
export type RemoveFieldsByIdAction = ReduxStandardAction<"REMOVE_FIELDS_BY_ID", {fields: FieldId[]}>;

export function createRemoveFieldsAction(fields: Field[]): RemoveFieldsAction {
    return {type: "REMOVE_FIELDS", payload: {fields}};
}

export function createRemoveFieldsByIdAction(fields: FieldId[]): RemoveFieldsByIdAction {
    return {type: "REMOVE_FIELDS_BY_ID", payload: {fields}};
}