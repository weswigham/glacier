import {ReduxStandardAction} from "./";
import {Field} from "../model";

export type RemoveFieldsAction = ReduxStandardAction<"REMOVE_FIELDS", {fields: Field[]}>;
export type RemoveFieldsByIdAction = ReduxStandardAction<"REMOVE_FIELDS_BY_ID", {fields: number[]}>;

export function createRemoveFieldsAction(fields: Field[]): RemoveFieldsAction {
    return {type: "REMOVE_FIELDS", payload: {fields}};
}

export function createRemoveFieldsByIdAction(fields: number[]): RemoveFieldsByIdAction {
    return {type: "REMOVE_FIELDS_BY_ID", payload: {fields}};
}